require("dotenv").config();
require("../src/config/env");

const { connect: connectMongo } = require("../src/config/mongo");
const { connect: connectRedis, cacheClient } = require("../src/config/redis");
const cacheService = require("../src/cache/cache.service");
const KEYS = require("../src/cache/cache.keys");

const warmCache = async () => {
  console.log("🔥  Starting cache warm-up...");

  await connectMongo();
  await connectRedis();

  const Category = require("../src/models/Category.model");
  const Product = require("../src/models/Product.model");

  
  const categories = await Category.find({ isActive: true }).lean();
  await cacheService.set(KEYS.CATEGORY_TREE, categories, 3600);
  console.log(`✅  Categories warmed: ${categories.length}`);

  
  const popularProducts = await Product.find({ isActive: true })
    .sort({ soldCount: -1 })
    .limit(50)
    .lean();

  for (const product of popularProducts) {
    await cacheService.set(KEYS.PRODUCT(product._id), product, 600);
  }
  console.log(`✅  Products warmed: ${popularProducts.length}`);

  
  const featuredProducts = await Product.find({
    isActive: true,
    isFeatured: true,
  }).lean();
  await cacheService.set("products:featured", featuredProducts, 600);
  console.log(`✅  Featured products warmed: ${featuredProducts.length}`);

  console.log("✅  Cache warm-up complete!");
  cacheClient.disconnect();
  process.exit(0);
};

warmCache().catch((err) => {
  console.error("❌  Cache warm-up failed:", err.message);
  process.exit(1);
});