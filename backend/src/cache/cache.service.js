const { cacheClient } = require("../config/redis");

// ── Cache Service ────────────────────────────────────────────────
// Wrapper around ioredis — saari caching logic yahan

const cacheService = {
  // Get parsed value from cache
  async get(key) {
    try {
      const data = await cacheClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Cache GET error [${key}]:`, err.message);
      return null; // cache miss — DB se fetch hoga
    }
  },

  // Set JSON value with TTL (seconds)
  async set(key, value, ttlSeconds = 300) {
    try {
      await cacheClient.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      console.error(`Cache SET error [${key}]:`, err.message);
      // Cache fail hone par bhi request fail nahi karni
    }
  },

  // Delete a key
  async del(key) {
    try {
      await cacheClient.del(key);
    } catch (err) {
      console.error(`Cache DEL error [${key}]:`, err.message);
    }
  },

  // Delete multiple keys matching a pattern
  // Careful: KEYS command production mein slow ho sakta hai large datasets par
  async invalidatePattern(pattern) {
    try {
      const keys = await cacheClient.keys(pattern);
      if (keys.length > 0) {
        await cacheClient.del(...keys);
        console.log(`🗑️   Cache invalidated: ${keys.length} keys (${pattern})`);
      }
    } catch (err) {
      console.error(`Cache INVALIDATE error [${pattern}]:`, err.message);
    }
  },

  // Cache-aside pattern: try cache first, fallback to fetchFn
  async getOrSet(key, fetchFn, ttlSeconds = 300) {
    const cached = await this.get(key);
    if (cached !== null) return cached;

    const fresh = await fetchFn();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  },

  // Check if key exists
  async exists(key) {
    try {
      return (await cacheClient.exists(key)) === 1;
    } catch (err) {
      return false;
    }
  },

  // Set with no expiry (permanent)
  async setPermanent(key, value) {
    try {
      await cacheClient.set(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Cache SET PERM error [${key}]:`, err.message);
    }
  },

  // Atomic increment (inventory, coupon usage ke liye)
  async incr(key) {
    return cacheClient.incr(key);
  },

  // Atomic decrement (stock ke liye)
  async decr(key) {
    return cacheClient.decr(key);
  },

  // TTL check (remaining seconds)
  async ttl(key) {
    return cacheClient.ttl(key);
  },
};

module.exports = cacheService;
