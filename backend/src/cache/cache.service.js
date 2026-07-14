const { cacheClient } = require("../config/redis");




const cacheService = {
  
  async get(key) {
    try {
      const data = await cacheClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Cache GET error [${key}]:`, err.message);
      return null; 
    }
  },

  
  async set(key, value, ttlSeconds = 300) {
    try {
      await cacheClient.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (err) {
      console.error(`Cache SET error [${key}]:`, err.message);
      
    }
  },

  
  async del(key) {
    try {
      await cacheClient.del(key);
    } catch (err) {
      console.error(`Cache DEL error [${key}]:`, err.message);
    }
  },

  
  
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

  
  async getOrSet(key, fetchFn, ttlSeconds = 300) {
    const cached = await this.get(key);
    if (cached !== null) return cached;

    const fresh = await fetchFn();
    if (fresh !== null && fresh !== undefined) {
      await this.set(key, fresh, ttlSeconds);
    }
    return fresh;
  },

  
  async exists(key) {
    try {
      return (await cacheClient.exists(key)) === 1;
    } catch (err) {
      return false;
    }
  },

  
  async setPermanent(key, value) {
    try {
      await cacheClient.set(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Cache SET PERM error [${key}]:`, err.message);
    }
  },

  
  async incr(key) {
    return cacheClient.incr(key);
  },

  
  async decr(key) {
    return cacheClient.decr(key);
  },

  
  async ttl(key) {
    return cacheClient.ttl(key);
  },
};

module.exports = cacheService;
