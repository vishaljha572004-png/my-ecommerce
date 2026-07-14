const app = require("./app");
const { mongo, redis, env } = require("./config");

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    
    await mongo.connect();

    
    if (redis.cacheClient.status !== "ready") {
      await redis.connect();
    }

    
    require("./workers/order.worker");
    require("./workers/notification.worker");
    require("./workers/inventory.worker");
    console.log("📬  BullMQ workers started");

    
    const server = app.listen(PORT, () => {
      console.log(`\n🚀  Server running on http://localhost:${PORT}`);
      console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
      console.log(`🍃  Mongo UI:     http://localhost:8081`);
      console.log(`🔴  Redis UI:     http://localhost:8082\n`);
    });

    
    const socket = require("./socket");
    socket.init(server);

    
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log("HTTP server closed");
        try {
          await require("mongoose").connection.close();
          console.log("MongoDB connection closed");
          redis.cacheClient.disconnect();
          redis.queueClient.disconnect();
          console.log("Redis connections closed");
        } catch (err) {
          console.error("Error during shutdown:", err.message);
        }
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("unhandledRejection", (err) => {
      console.error("Unhandled Rejection:", err.message);
      shutdown("UNHANDLED_REJECTION");
    });

  } catch (err) {
    console.error("Server startup failed:", err.message);
    process.exit(1);
  }
};

startServer();