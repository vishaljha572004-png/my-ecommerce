const { Worker } = require("bullmq");
const { queueClient } = require("../config/redis");

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { type, recipient, data } = job.data;

    console.log(`Processing notification: ${type} to ${recipient}`);

    switch (type) {
      case "ORDER_CONFIRMED":
        
        console.log(`SMS: Order ${data.orderNumber} confirmed for ${recipient}`);
        break;

      case "ORDER_DELIVERED":
        console.log(`SMS: Order ${data.orderNumber} delivered to ${recipient}`);
        break;

      case "WELCOME":
        
        console.log(`Email: Welcome email sent to ${recipient}`);
        break;

      case "LOW_STOCK":
        console.log(`Alert: Low stock for product ${data.productName}`);
        break;

      default:
        console.log(`Unknown notification type: ${type}`);
    }

    return { success: true, type, recipient };
  },
  {
    connection: queueClient,
    concurrency: 10,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`Notification job ${job.id} completed`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Notification job ${job.id} failed:`, err.message);
});

module.exports = notificationWorker;