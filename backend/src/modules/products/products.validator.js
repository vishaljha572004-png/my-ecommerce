const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().required().messages({ "any.required": "Product name is required" }),
  description: Joi.string().optional().allow(""),
  categoryId: Joi.string().required().messages({ "any.required": "Category is required" }),
  brand: Joi.string().optional().allow(""),
  unit: Joi.string().optional().default("piece"),
  price: Joi.number().min(0).required().messages({ "any.required": "Price is required" }),
  discountedPrice: Joi.number().min(0).optional().allow(null),
  stock: Joi.number().min(0).default(0),
  images: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  variants: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      stock: Joi.number().default(0),
      sku: Joi.string().optional().allow(""),
    })
  ).optional(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  categoryId: Joi.string().optional(),
  brand: Joi.string().optional().allow(""),
  unit: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  discountedPrice: Joi.number().min(0).optional().allow(null),
  stock: Joi.number().min(0).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

module.exports = { createProductSchema, updateProductSchema };