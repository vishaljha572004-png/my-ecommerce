const AppError = require("./AppError");
const { env } = require("../../config");

// Mongoose validation error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${errors.join(", ")}`, 400);
};

// Mongoose duplicate key
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
};

// JWT errors
const handleJWTError = () => new AppError("Invalid token. Please login again.", 401);
const handleJWTExpiredError = () => new AppError("Token expired. Please login again.", 401);

// ── Global error handler ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert known error types to AppError
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
  if (err.name === "CastError") error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);

  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : "Something went wrong";

  // Stack trace sirf development mein
  const response = {
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
