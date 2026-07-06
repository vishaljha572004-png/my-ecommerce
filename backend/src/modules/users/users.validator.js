const Joi = require("joi");

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .optional()
    .messages({ "string.pattern.base": "Please provide a valid 10-digit Indian mobile number" }),
});

const addAddressSchema = Joi.object({
  label: Joi.string().valid("home", "work", "other").default("home"),
  street: Joi.string().required().messages({ "any.required": "Street is required" }),
  city: Joi.string().required().messages({ "any.required": "City is required" }),
  state: Joi.string().required().messages({ "any.required": "State is required" }),
  postalCode: Joi.string().required().messages({ "any.required": "Postal code is required" }),
  country: Joi.string().default("India"),
  isDefault: Joi.boolean().default(false),
});

const updateAddressSchema = Joi.object({
  label: Joi.string().valid("home", "work", "other").optional(),
  street: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
});

module.exports = { updateProfileSchema, addAddressSchema, updateAddressSchema };