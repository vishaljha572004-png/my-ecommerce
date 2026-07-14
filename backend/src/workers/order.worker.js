const { Worker } = require("bullmq");
const { queueClient } = require("../config/redis");
const Order = require("../models/Order.model");
const User = require("../models/User.model");

const orderWorker = new Worker(
  "order-processing",
  async (job) => {
    const { orderId } = job.data;

    console.log(`Processing order job: ${orderId}`);

    const order = await Order.findById(orderId).lean();
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    const user = await User.findById(order.userId).lean();
    if (!user) {
      console.error(`User not found for order: ${orderId}`);
      return;
    }

    
    
    console.log(`
      ✅ Order Confirmation Sent
      Order: ${order.orderNumber}
      User: ${user.firstName} ${user.lastName}
      Email: ${user.email}
      Amount: ₹${order.totalAmount}
      Status: ${order.status}
    `);

    return { success: true, orderId };
  },
  {
    connection: queueClient,
    concurrency: 5,
  }
);

orderWorker.on("completed", (job) => {
  console.log(`Order job ${job.id} completed`);
});

orderWorker.on("failed", (job, err) => {
  console.error(`Order job ${job.id} failed:`, err.message);
});

module.exports = orderWorker;