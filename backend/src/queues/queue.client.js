const { Queue } = require("bullmq");
const { queueClient } = require("../config/redis");

const connection = queueClient;

// ── Queue definitions ────────────────────────────────────────────
const orderQueue = new Queue("order-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 100, // last 100 completed jobs rakhna
    removeOnFail: 500,
  },
});

const notificationQueue = new Queue("notifications", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 200,
  },
});

const inventoryQueue = new Queue("inventory-sync", {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: "fixed", delay: 1000 },
    removeOnComplete: 50,
    removeOnFail: 100,
  },
});

console.log("📬  BullMQ queues initialized");

module.exports = { orderQueue, notificationQueue, inventoryQueue };
