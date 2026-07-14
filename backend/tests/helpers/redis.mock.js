const RedisMock = require("ioredis-mock");




const createRedisMock = () => new RedisMock();

module.exports = { createRedisMock };
