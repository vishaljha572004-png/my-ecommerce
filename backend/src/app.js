require("dotenv").config();
require("./config/env");

const express = require("express");
const cors = require("cors");
const logger = require("./common/middleware/logger");
const errorHandler = require("./common/errors/errorHandler");
const { defaultLimiter } = require("./common/middleware/rateLimiter");


const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const categoriesRoutes = require("./modules/categories/categories.routes");
const productsRoutes = require("./modules/products/products.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const searchRoutes = require("./modules/search/search.routes");
const ordersRoutes = require("./modules/orders/orders.routes");
const paymentsRoutes = require("./modules/payments/payments.routes");
const deliveryRoutes = require("./modules/delivery/delivery.routes");
const promotionsRoutes = require("./modules/promotions/promotions.routes");
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const recommendationsRoutes = require("./modules/recommendations/recommendations.routes");
const shoppingListRoutes = require("./modules/shoppingList/shoppingList.routes");
const offersRoutes = require("./modules/offers/offers.routes");

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(defaultLimiter);


app.get("/api/health", async (req, res) => {
  const { redis } = require("./config");
  const mongoose = require("mongoose");

  let redisStatus = "disconnected";
  try {
    const pong = await redis.ping();
    redisStatus = pong ? "connected" : "disconnected";
  } catch (_) {
    redisStatus = "disconnected";
  }

  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const isHealthy = mongoStatus === "connected" && redisStatus === "connected";

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: { mongo: mongoStatus, redis: redisStatus },
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/shopping-list", shoppingListRoutes);
app.use("/api/offers", offersRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});


app.use(errorHandler);

module.exports = app;