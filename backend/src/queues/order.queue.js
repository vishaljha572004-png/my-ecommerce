const { orderQueue } = require("./queue.client");


const addOrderJob = async (orderId) => {
  await orderQueue.add(
    "order-confirmation",
    { orderId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    }
  );
  console.log(`Order job added for: ${orderId}`);
};

module.exports = { addOrderJob };