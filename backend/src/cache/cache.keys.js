



const KEYS = {
  
  PRODUCT: (id) => `product:${id}`,
  PRODUCTS_LIST: (query) => `products:list:${query}`,

  
  CATEGORY_TREE: "category:tree",
  CATEGORY: (id) => `category:${id}`,

  
  CART: (userId) => `cart:${userId}`,

  
  REFRESH_TOKEN: (userId) => `refresh:${userId}`,
  TOKEN_BLACKLIST: (jti) => `blacklist:${jti}`,

  
  SESSION: (userId) => `session:${userId}`,

  
  SEARCH_RESULTS: (query) => `search:${encodeURIComponent(query)}`,
  AUTOCOMPLETE: "search:autocomplete",

  
  SLOT_LOCK: (slotId) => `slot:lock:${slotId}`,

  
  STOCK: (productId) => `stock:${productId}`,

  
  COUPON: (code) => `coupon:${code}`,
  COUPON_USAGE: (code) => `coupon:usage:${code}`,

  
  RATE_LIMIT: (ip) => `ratelimit:${ip}`,
};

module.exports = KEYS;
