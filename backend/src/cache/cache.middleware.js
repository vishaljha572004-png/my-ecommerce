const cacheService = require("./cache.service");




const cacheMiddleware = (ttlSeconds = 300) => async (req, res, next) => {
  
  if (req.user) return next();

  const key = `route:${req.originalUrl}`;
  const cached = await cacheService.get(key);

  if (cached) {
    return res.status(200).json({ ...cached, _cached: true });
  }

  
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
