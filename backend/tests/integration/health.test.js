const request = require("supertest");




describe("GET /api/health", () => {
  let app;

  beforeAll(() => {
    
    process.env.MONGO_URI = "mongodb://localhost:27017/test";
    process.env.JWT_ACCESS_SECRET = "test_access_secret_32chars_long!";
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret_32chars_long";
    app = require("../../src/app");
  });

  it("should return health status JSON", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body).toHaveProperty("services");
    expect(res.body.services).toHaveProperty("mongo");
    expect(res.body.services).toHaveProperty("redis");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown-route-xyz");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
