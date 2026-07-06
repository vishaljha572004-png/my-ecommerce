const { notificationQueue } = require("./queue.client");

// ── Add notification job ─────────────────────────────────────────
const addNotificationJob = async (type, recipient, data = {}) => {
  await notificationQueue.add(
    type,
    { type, recipient, data },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 1000 },
    }
  );
  console.log(`Notification job added: ${type} to ${recipient}`);
};

module.exports = { addNotificationJob };