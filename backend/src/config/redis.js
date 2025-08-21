import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => console.error('Redis Client Error:', err));

(async () => {
  try {
    await client.connect();
    console.log('⚡ Redis connected');
  } catch (err) {
    console.warn('Redis unavailable. Continuing without cache/rate limit. Reason:', err.message);
  }
})();

export default client;
