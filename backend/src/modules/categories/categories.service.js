const Category = require("../../models/Category.model");
const AppError = require("../../common/errors/AppError");
const cacheService = require("../../cache/cache.service");
const KEYS = require("../../cache/cache.keys");
const { env } = require("../../config");


const getAllCategories = async () => {
  return cacheService.getOrSet(
    KEYS.CATEGORY_TREE,
    async () => {
      return Category.find({ isActive: true })
        .sort({ displayOrder: 1, name: 1 })
        .lean();
    },
    env.CACHE_TTL_CATEGORY
  );
};


const getCategoryById = async (id) => {
  return cacheService.getOrSet(
    KEYS.CATEGORY(id),
    async () => {
      const category = await Category.findById(id).lean();
      if (!category) throw new AppError("Category not found", 404);
      return category;
    },
    env.CACHE_TTL_CATEGORY
  );
};


const createCategory = async (data) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw new AppError("Category with this name already exists", 409);

  const category = await Category.create(data);

  
  await cacheService.del(KEYS.CATEGORY_TREE);

  return category;
};


const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!category) throw new AppError("Category not found", 404);

  
  await cacheService.del(KEYS.CATEGORY_TREE);
  await cacheService.del(KEYS.CATEGORY(id));

  return category;
};


const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError("Category not found", 404);

  await cacheService.del(KEYS.CATEGORY_TREE);
  await cacheService.del(KEYS.CATEGORY(id));

  return category;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};