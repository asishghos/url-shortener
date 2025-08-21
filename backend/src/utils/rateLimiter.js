import redisClient from '../config/redis.js';

const rateLimitMiddleware = (limit, windowSeconds) => {
  return async (req, res, next) => {
    try {
      if (!redisClient || !redisClient.isOpen) {
        return next();
      }

      const ip = req.ip;
      const key = `rate:${ip}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (current > limit) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }

      next();
    } catch (err) {
      console.warn('Rate limiter disabled due to Redis error:', err.message);
      next();
    }
  };
};

export default rateLimitMiddleware;
