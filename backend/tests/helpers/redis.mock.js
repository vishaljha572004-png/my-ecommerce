const RedisMock = require("ioredis-mock");

// Unit tests mein real Redis ki zaroorat nahi
// ioredis-mock same API provide karta hai

const createRedisMock = () => new RedisMock();

module.exports = { createRedisMock };
