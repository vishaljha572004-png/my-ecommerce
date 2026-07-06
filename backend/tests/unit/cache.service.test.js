const { createRedisMock } = require("../helpers/redis.mock");

jest.mock("../../src/config/redis", () => ({
  cacheClient: createRedisMock(),
  connect: jest.fn(),
  ping: jest.fn(),
}));

const cacheService = require("../../src/cache/cache.service");

describe("Cache Service", () => {
  beforeEach(async () => {
    const { cacheClient } = require("../../src/config/redis");
    await cacheClient.flushall();
  });

  it("should set and get a value", async () => {
    await cacheService.set("test:key", { name: "Rahul" }, 60);
    const result = await cacheService.get("test:key");
    expect(result).toEqual({ name: "Rahul" });
  });

  it("should return null for missing key", async () => {
    const result = await cacheService.get("nonexistent:key");
    expect(result).toBeNull();
  });

  it("should delete a key", async () => {
    await cacheService.set("test:delete", "value", 60);
    await cacheService.del("test:delete");
    const result = await cacheService.get("test:delete");
    expect(result).toBeNull();
  });

  it("should use getOrSet pattern", async () => {
    const fetchFn = jest.fn().mockResolvedValue({ data: "fresh" });

    const result1 = await cacheService.getOrSet("test:getorset", fetchFn, 60);
    const result2 = await cacheService.getOrSet("test:getorset", fetchFn, 60);

    expect(result1).toEqual({ data: "fresh" });
    expect(result2).toEqual({ data: "fresh" });
    expect(fetchFn).toHaveBeenCalledTimes(1); // fetched only once
  });

  it("should increment and decrement", async () => {
    await cacheService.set("test:counter", 5, 60);

    // Direct Redis ops
    const { cacheClient } = require("../../src/config/redis");
    await cacheClient.set("test:counter", 5);

    const after = await cacheService.incr("test:counter");
    expect(after).toBe(6);

    const afterDecr = await cacheService.decr("test:counter");
    expect(afterDecr).toBe(5);
  });
});