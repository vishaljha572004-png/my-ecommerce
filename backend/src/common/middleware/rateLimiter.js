// ── Redis-backed Rate Limiter ────────────────────────────────────
// Day 4 mein poora implement karenge
// Abhi ke liye in-memory limiter use karo (express-rate-limit)
const rateLimit = require("express-rate-limit");

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // login/register ke liye strict limit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts. Please try again after 15 minutes.",
  },
});

module.exports = { defaultLimiter, authLimiter };
