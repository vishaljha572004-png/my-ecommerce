const express = require("express");
const router = express.Router();

const ordersController = require("./orders.controller");
const { authenticate, adminOnly } = require("../auth/auth.middleware");
const validate = require("../../common/middleware/validate");
const { createOrderSchema } = require("./orders.validator");

// All order routes require authentication
router.use(authenticate);

// User routes
router.post("/", validate(createOrderSchema), ordersController.createOrder);
router.get("/", ordersController.getUserOrders);
router.get("/:id", ordersController.getOrderById);
router.put("/:id/cancel", ordersController.cancelOrder);

// Admin routes
router.put("/:id/status", adminOnly, ordersController.updateOrderStatus);

module.exports = router;