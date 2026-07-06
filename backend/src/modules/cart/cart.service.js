const { cacheClient } = require("../../config/redis");
const Product = require("../../models/Product.model");
const AppError = require("../../common/errors/AppError");
const KEYS = require("../../cache/cache.keys");

// Cart is stored as Redis Hash
// Key: cart:{userId}
// Field: productId
// Value: quantity

// ── Get cart with product details ───────────────────────────────
const getCart = async (userId) => {
  const cartKey = KEYS.CART(userId);
  const cartData = await cacheClient.hgetall(cartKey);

  if (!cartData || Object.keys(cartData).length === 0) {
    return { items: [], totalAmount: 0, totalItems: 0 };
  }

  // Fetch product details for all cart items
  const productIds = Object.keys(cartData);
  const products = await Product.find({ _id: { $in: productIds } })
    .select("name price discountedPrice images stock isActive unit")
    .lean();

  const items = [];
  let totalAmount = 0;

  for (const product of products) {
    const quantity = parseInt(cartData[product._id.toString()]);
    const price = product.discountedPrice || product.price;
    const itemTotal = price * quantity;

    items.push({
      product,
      quantity,
      price,
      itemTotal,
    });

    totalAmount += itemTotal;
  }

  return {
    items,
    totalAmount: Math.round(totalAmount * 100) / 100,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  };
};

// ── Add item to cart ─────────────────────────────────────────────
const addToCart = async (userId, productId, quantity) => {
  // Validate product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  const cartKey = KEYS.CART(userId);

  // Check if item already in cart
  const existingQty = await cacheClient.hget(cartKey, productId);
  const newQty = existingQty ? parseInt(existingQty) + quantity : quantity;

  if (newQty > product.stock) {
    throw new AppError(`Only ${product.stock} items available in stock`, 400);
  }

  // Store in Redis Hash — set TTL to 7 days
  await cacheClient.hset(cartKey, productId, newQty);
  await cacheClient.expire(cartKey, 7 * 24 * 60 * 60);

  return getCart(userId);
};

// ── Update item quantity ─────────────────────────────────────────
const updateCartItem = async (userId, productId, quantity) => {
  const cartKey = KEYS.CART(userId);

  const exists = await cacheClient.hexists(cartKey, productId);
  if (!exists) throw new AppError("Item not found in cart", 404);

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    await cacheClient.hdel(cartKey, productId);
  } else {
    const product = await Product.findById(productId);
    if (product && quantity > product.stock) {
      throw new AppError(`Only ${product.stock} items available in stock`, 400);
    }
    await cacheClient.hset(cartKey, productId, quantity);
  }

  return getCart(userId);
};

// ── Remove item from cart ────────────────────────────────────────
const removeFromCart = async (userId, productId) => {
  const cartKey = KEYS.CART(userId);
  await cacheClient.hdel(cartKey, productId);
  return getCart(userId);
};

// ── Clear entire cart ────────────────────────────────────────────
const clearCart = async (userId) => {
  await cacheClient.del(KEYS.CART(userId));
  return { items: [], totalAmount: 0, totalItems: 0 };
};

// ── Get raw cart data (used during checkout) ─────────────────────
const getRawCart = async (userId) => {
  const cartKey = KEYS.CART(userId);
  return cacheClient.hgetall(cartKey);
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getRawCart,
};