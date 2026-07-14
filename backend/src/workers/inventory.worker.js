const { Worker } = require("bullmq");
const { queueClient } = require("../config/redis");
const Product = require("../models/Product.model");

const inventoryWorker = new Worker(
  "inventory-sync",
  async (job) => {
    const { productId, threshold } = job.data;

    const product = await Product.findById(productId)
      .select("name stock unit")
      .lean();

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    if (product.stock <= (threshold || 10)) {
      
      console.log(`
        ⚠️  Low Stock Alert
        Product: ${product.name}
        Current Stock: ${product.stock} ${product.unit}
        Threshold: ${threshold || 10}
        Action Required: Restock immediately
      `);
    }

    return { success: true, productId, stock: product.stock };
  },
  {
    connection: queueClient,
    concurrency: 3,
  }
);

inventoryWorker.on("completed", (job) => {
  console.log(`Inventory job ${job.id} completed`);
});

inventoryWorker.on("failed", (job, err) => {
  console.error(`Inventory job ${job.id} failed:`, err.message);
});

module.exports = inventoryWorker;