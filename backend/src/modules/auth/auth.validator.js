const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name kam se kam 2 characters ka hona chahiye",
    "any.required": "First name required hai",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "any.required": "Last name required hai",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email daalo",
    "any.required": "Email required hai",
  }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Password kam se kam 6 characters ka hona chahiye",
    "any.required": "Password required hai",
  }),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({ "string.pattern.base": "Valid Indian mobile number daalo (10 digits)" }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Valid email daalo",
    "any.required": "Email required hai",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password required hai",
  }),
});

module.exports = { registerSchema, loginSchema };