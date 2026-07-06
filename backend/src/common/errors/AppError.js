class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // known errors — don't crash server
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
