const { inventoryQueue } = require("./queue.client");


const addInventoryCheckJob = async (productId, threshold = 10) => {
  await inventoryQueue.add(
    "stock-check",
    { productId, threshold },
    {
      attempts: 5,
      backoff: { type: "fixed", delay: 1000 },
    }
  );
};

module.exports = { addInventoryCheckJob };