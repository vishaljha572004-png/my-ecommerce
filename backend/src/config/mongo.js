const mongoose = require("mongoose");
const env = require("./env");

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

let retries = 0;

const connect = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅  MongoDB connected:", mongoose.connection.host);
    retries = 0; 
  } catch (err) {
    retries += 1;
    console.error(`❌  MongoDB connection failed (attempt ${retries}/${MAX_RETRIES}):`, err.message);

    if (retries >= MAX_RETRIES) {
      console.error("💀  Max MongoDB retries reached. Exiting.");
      process.exit(1);
    }

    console.log(`🔄  Retrying in ${RETRY_DELAY_MS / 1000}s...`);
    setTimeout(connect, RETRY_DELAY_MS);
  }
};


mongoose.connection.on("disconnected", () => {
  console.warn("⚠️   MongoDB disconnected. Attempting reconnect...");
  if (retries < MAX_RETRIES) connect();
});

mongoose.connection.on("error", (err) => {
  console.error("❌  MongoDB error:", err.message);
});

module.exports = { connect };
