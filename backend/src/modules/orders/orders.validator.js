const Joi = require("joi");

const createOrderSchema = Joi.object({
  addressId: Joi.string().optional().allow(""),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().optional().default("India")
  }).optional(),
  paymentMethod: Joi.string().valid("cod", "online", "card", "upi").default("cod"),
  deliverySlot: Joi.string().optional().allow(""),
  notes: Joi.string().optional().allow(""),
  couponCode: Joi.string().optional().allow(""),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().required(),
      variant: Joi.string().optional().allow(""),
      price: Joi.number().optional()
    }).unknown(true)
  ).optional(),
  totalAmount: Joi.number().optional()
});

module.exports = { createOrderSchema };