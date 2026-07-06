const Redis = require('ioredis');

const flushRedis = async () => {
  try {
    const redis = new Redis({
      host: 'localhost',
      port: 6379
    });
    
    await redis.flushall();
    console.log('Redis flushed completely.');
    process.exit(0);
  } catch (error) {
    console.error('Error flushing redis:', error);
    process.exit(1);
  }
};

flushRedis();
