const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const { authenticate } = require("./auth.middleware");
const validate = require("../../common/middleware/validate");
const { registerSchema, loginSchema } = require("./auth.validator");
const { authLimiter } = require("../../common/middleware/rateLimiter");

// Public routes
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
