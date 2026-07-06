const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().min(1).default(1).messages({
    "number.min": "Quantity must be at least 1",
  }),
});

const updateCartSchema = Joi.object({
  quantity: Joi.number().min(0).required().messages({
    "any.required": "Quantity is required",
    "number.min": "Quantity cannot be negative",
  }),
});

module.exports = { addToCartSchema, updateCartSchema };