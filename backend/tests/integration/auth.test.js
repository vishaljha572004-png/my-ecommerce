const request = require("supertest");
const { connect, disconnect, clearDatabase } = require("../helpers/mongo.mock");


jest.mock("../../src/config/redis", () => {
  const RedisMock = require("ioredis-mock");
  const client = new RedisMock();
  return {
    cacheClient: client,
    queueClient: client,
    connect: jest.fn(),
    ping: jest.fn().mockResolvedValue(true),
  };
});


jest.mock("../../src/queues/order.queue", () => ({
  addOrderJob: jest.fn(),
}));
jest.mock("../../src/queues/notification.queue", () => ({
  addNotificationJob: jest.fn(),
}));
jest.mock("../../src/queues/inventory.queue", () => ({
  addInventoryCheckJob: jest.fn(),
}));

let app;

beforeAll(async () => {
  await connect();
  process.env.JWT_ACCESS_SECRET = "test_access_secret_32chars_long!";
  process.env.JWT_REFRESH_SECRET = "test_refresh_secret_32chars_long";
  app = require("../../src/app");
});

afterAll(async () => {
  await disconnect();
});

afterEach(async () => {
  await clearDatabase();
});

describe("Auth API", () => {
  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password123",
    phone: "9876543210",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data).toHaveProperty("refreshToken");
    });

    it("should not register with duplicate email", async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("should reject invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return user profile with valid token", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      const { accessToken } = registerRes.body.data;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });
  });
});