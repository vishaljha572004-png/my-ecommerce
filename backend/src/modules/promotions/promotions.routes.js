const express = require("express");
const router = express.Router();

const promotionsController = require("./promotions.controller");
const { authenticate, adminOnly } = require("../auth/auth.middleware");

// User routes
router.post("/validate", authenticate, promotionsController.validateCoupon);

// Admin routes
router.post("/", authenticate, adminOnly, promotionsController.createCoupon);
router.get("/", authenticate, adminOnly, promotionsController.getAllCoupons);
router.put("/:id/toggle", authenticate, adminOnly, promotionsController.toggleCoupon);

module.exports = router;