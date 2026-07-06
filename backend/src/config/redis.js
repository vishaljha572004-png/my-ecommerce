const Redis = require("ioredis");
const env = require("./env");

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 500, 30000);
    console.log(`Redis retry attempt ${times}, waiting ${delay}ms...`);
    return delay;
  },
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

// Cache client — for cart, sessions, product cache, rate limiting
const cacheClient = new Redis(redisOptions);

cacheClient.on("connect", () => console.log("✅  Redis (cache) connected"));
cacheClient.on("error", (err) => console.error("❌  Redis (cache) error:", err.message));
cacheClient.on("reconnecting", () => console.warn("Redis (cache) reconnecting..."));

// Queue client — separate connection required by BullMQ
const queueClient = new Redis(redisOptions);

queueClient.on("connect", () => console.log("✅  Redis (queue) connected"));
queueClient.on("error", (err) => console.error("❌  Redis (queue) error:", err.message));
queueClient.on("reconnecting", () => console.warn("Redis (queue) reconnecting..."));

// Health check helper for /api/health route
const ping = async () => {
  const result = await cacheClient.ping();
  return result === "PONG";
};

// connect function — no-op since lazyConnect removed
const connect = async () => {
  // Redis connects automatically on first use
  return Promise.resolve();
};

module.exports = { cacheClient, queueClient, connect, ping };