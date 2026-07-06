const jwt = require("jsonwebtoken");
const User = require("../../models/User.model");
const AppError = require("../../common/errors/AppError");
const env = require("../../config/env");
const { cacheClient } = require("../../config/redis");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Login karo pehle", 401));
    }

    const token = authHeader.split(" ")[1];

    const isBlacklisted = await cacheClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return next(new AppError("Token invalid hai, dobara login karo", 401));
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new AppError("User nahi mila", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") return next(new AppError("Invalid token", 401));
    if (err.name === "TokenExpiredError") return next(new AppError("Token expire ho gaya", 401));
    next(err);
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Sirf admin yeh kar sakta hai", 403));
  }
  next();
};

module.exports = { authenticate, adminOnly };