const { createRedisMock } = require("../helpers/redis.mock");


jest.mock("../../src/config/redis", () => ({
  cacheClient: createRedisMock(),
  queueClient: createRedisMock(),
  connect: jest.fn(),
  ping: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../src/models/Product.model");

const Product = require("../../src/models/Product.model");
const { cacheClient } = require("../../src/config/redis");

describe("Cart Service", () => {
  const userId = "user123";
  const productId = "product123";

  beforeEach(async () => {
    await cacheClient.flushall();
    jest.clearAllMocks();
  });

  describe("addToCart", () => {
    it("should add item to cart successfully", async () => {
      Product.findById = jest.fn().mockResolvedValue({
        _id: productId,
        name: "Test Product",
        price: 100,
        stock: 50,
        isActive: true,
      });

      const cartService = require("../../src/modules/cart/cart.service");

      
      Product.find = jest.fn().mockResolvedValue([]);

      await cartService.addToCart(userId, productId, 2);

      const qty = await cacheClient.hget(`cart:${userId}`, productId);
      expect(parseInt(qty)).toBe(2);
    });

    it("should throw error if product not found", async () => {
      Product.findById = jest.fn().mockResolvedValue(null);

      const cartService = require("../../src/modules/cart/cart.service");

      await expect(
        cartService.addToCart(userId, productId, 1)
      ).rejects.toThrow("Product not found");
    });

    it("should throw error if insufficient stock", async () => {
      Product.findById = jest.fn().mockResolvedValue({
        _id: productId,
        stock: 5,
        isActive: true,
      });

      const cartService = require("../../src/modules/cart/cart.service");

      await expect(
        cartService.addToCart(userId, productId, 10)
      ).rejects.toThrow("Only 5 items available in stock");
    });
  });

  describe("removeFromCart", () => {
    it("should remove item from cart", async () => {
      await cacheClient.hset(`cart:${userId}`, productId, 2);
      Product.find = jest.fn().mockResolvedValue([]);

      const cartService = require("../../src/modules/cart/cart.service");
      await cartService.removeFromCart(userId, productId);

      const qty = await cacheClient.hget(`cart:${userId}`, productId);
      expect(qty).toBeNull();
    });
  });

  describe("clearCart", () => {
    it("should clear entire cart", async () => {
      await cacheClient.hset(`cart:${userId}`, productId, 2);

      const cartService = require("../../src/modules/cart/cart.service");
      const result = await cartService.clearCart(userId);

      expect(result.items).toHaveLength(0);
      expect(result.totalAmount).toBe(0);
    });
  });
});