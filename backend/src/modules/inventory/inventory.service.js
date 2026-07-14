const Product = require("../../models/Product.model");
const AppError = require("../../common/errors/AppError");
const { cacheClient } = require("../../config/redis");
const KEYS = require("../../cache/cache.keys");
const cacheService = require("../../cache/cache.service");


const getStock = async (productId) => {
  const product = await Product.findById(productId).select("name stock").lean();
  if (!product) throw new AppError("Product not found", 404);
  return product;
};


const updateStock = async (productId, quantity) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: { stock: quantity } },
    { new: true }
  );
  if (!product) throw new AppError("Product not found", 404);

  
  await cacheService.del(KEYS.PRODUCT(productId));

  return product;
};


const incrementStock = async (productId, quantity) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: quantity } },
    { new: true }
  );
  if (!product) throw new AppError("Product not found", 404);

  await cacheService.del(KEYS.PRODUCT(productId));
  return product;
};


const getLowStockProducts = async (threshold = 10) => {
  return Product.find({
    isActive: true,
    stock: { $lte: threshold },
  })
    .select("name stock unit brand")
    .sort({ stock: 1 })
    .lean();
};

module.exports = {
  getStock,
  updateStock,
  incrementStock,
  getLowStockProducts,
};