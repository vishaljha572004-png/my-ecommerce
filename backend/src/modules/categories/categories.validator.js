const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Category name is required",
  }),
  description: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  banner: Joi.string().optional().allow(""),
  parentId: Joi.string().optional().allow(null),
  isActive: Joi.boolean().default(true),
  displayOrder: Joi.number().default(0),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(""),
  image: Joi.string().optional().allow(""),
  banner: Joi.string().optional().allow(""),
  parentId: Joi.string().optional().allow(null),
  isActive: Joi.boolean().optional(),
  displayOrder: Joi.number().optional(),
});

module.exports = { createCategorySchema, updateCategorySchema };