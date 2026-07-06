const Joi = require("joi");

const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(5000),

  MONGO_URI: Joi.string().required(),

  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow("").default(""),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default("7d"),

  CACHE_TTL_PRODUCT:  Joi.number().default(600),
  CACHE_TTL_CATEGORY: Joi.number().default(3600),
  CACHE_TTL_SEARCH:   Joi.number().default(300),
  CACHE_TTL_CART:     Joi.number().default(604800),

  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY:    Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
}).unknown(true);

const { error, value } = schema.validate(process.env);

if (error) {
  console.error("ENV validation failed:", error.message);
  process.exit(1);
}

module.exports = value;