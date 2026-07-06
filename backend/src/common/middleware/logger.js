const morgan = require("morgan");
const { env } = require("../../config");

// Development mein colored output, production mein combined format
const logger = morgan(env.NODE_ENV === "development" ? "dev" : "combined");

module.exports = logger;
