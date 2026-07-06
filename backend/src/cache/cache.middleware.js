const cacheService = require("./cache.service");

// ── Route-level Cache Middleware ─────────────────────────────────
// Usage: router.get("/products", cacheMiddleware(600), controller)

const cacheMiddleware = (ttlSeconds = 300) => async (req, res, next) => {
  // Authenticated routes cache mat karo (user-specific data)
  if (req.user) return next();

  const key = `route:${req.originalUrl}`;
  const cached = await cacheService.get(key);

  if (cached) {
    return res.status(200).json({ ...cached, _cached: true });
  }

  // Original res.json intercept karo to cache the response
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 200) {
      cacheService.set(key, body, ttlSeconds);
    }
    return originalJson(body);
  };

  next();
};

module.exports = cacheMiddleware;
