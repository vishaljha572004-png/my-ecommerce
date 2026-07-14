const morgan = require("morgan");
const { env } = require("../../config");


const logger = morgan(env.NODE_ENV === "development" ? "dev" : "combined");

module.exports = logger;
