// ── Redis Key Constants ──────────────────────────────────────────
// Saare Redis keys yahan define karo — typos se bachne ke liye
// Pattern: entity:identifier:subtype

const KEYS = {
  // Products
  PRODUCT: (id) => `product:${id}`,
  PRODUCTS_LIST: (query) => `products:list:${query}`,

  // Categories
  CATEGORY_TREE: "category:tree",
  CATEGORY: (id) => `category:${id}`,

  // Cart  (Redis Hash — HSET cart:{userId} productId qty)
  CART: (userId) => `cart:${userId}`,

  // Auth
  REFRESH_TOKEN: (userId) => `refresh:${userId}`,
  TOKEN_BLACKLIST: (jti) => `blacklist:${jti}`,

  // Sessions
  SESSION: (userId) => `session:${userId}`,

  // Search
  SEARCH_RESULTS: (query) => `search:${encodeURIComponent(query)}`,
  AUTOCOMPLETE: "search:autocomplete",

  // Delivery slots
  SLOT_LOCK: (slotId) => `slot:lock:${slotId}`,

  // Inventory (Redis counter)
  STOCK: (productId) => `stock:${productId}`,

  // Promotions
  COUPON: (code) => `coupon:${code}`,
  COUPON_USAGE: (code) => `coupon:usage:${code}`,

  // Rate limiting
  RATE_LIMIT: (ip) => `ratelimit:${ip}`,
};

module.exports = KEYS;
