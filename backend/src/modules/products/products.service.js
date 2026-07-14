const Product = require("../../models/Product.model");
const AppError = require("../../common/errors/AppError");
const cacheService = require("../../cache/cache.service");
const KEYS = require("../../cache/cache.keys");
const paginate = require("../../common/utils/paginate");
const { env } = require("../../config");


const getAllProducts = async (query) => {
  const { skip, limit, meta } = paginate(query);

  const filter = { isActive: true };
  if (query.categoryId) filter.categoryId = query.categoryId;
  if (query.category) filter.categoryId = query.category;
  
  if (query.search) {
    const searchRegex = new RegExp(query.search, "i");
    filter.$or = [
      { name: searchRegex },
      { description: searchRegex },
      { brand: searchRegex }
    ];
  }

  if (query.brand) filter.brand = new RegExp(query.brand, "i");
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.isFeatured === "true") filter.isFeatured = true;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, pagination: meta(total) };
};


const getProductById = async (id) => {
  return cacheService.getOrSet(
    KEYS.PRODUCT(id),
    async () => {
      const product = await Product.findById(id)
        .populate("categoryId", "name")
        .lean();
      if (!product) throw new AppError("Product not found", 404);
      return product;
    },
    env.CACHE_TTL_PRODUCT
  );
};


const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};


const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!product) throw new AppError("Product not found", 404);

  
  await cacheService.del(KEYS.PRODUCT(id));

  return product;
};


const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new AppError("Product not found", 404);

  await cacheService.del(KEYS.PRODUCT(id));

  return product;
};


const getFeaturedProducts = async () => {
  return cacheService.getOrSet(
    "products:featured",
    async () => {
      return Product.find({ isActive: true, isFeatured: true })
        .populate("categoryId", "name")
        .limit(10)
        .lean();
    },
    env.CACHE_TTL_PRODUCT
  );
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
};