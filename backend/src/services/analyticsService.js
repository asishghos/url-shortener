import redis from '../config/redis.js';

/**
 * Track a click event for a short URL
 * Uses Redis for ultra-fast in-memory operations
 * 
 * @param {string} shortId - The short URL identifier
 * @param {string} ip - Client IP address
 * @param {object} meta - Additional metadata (userAgent, referrer)
 */
export const trackClick = async (shortId, ip, meta = {}) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Increment total clicks for this URL
    await redis.incr(`url:clicks:${shortId}`);
    
    // Increment daily clicks using hash for better organization
    await redis.hIncrBy(`url:daily:${shortId}`, today, 1);
    
    // Update trending URLs sorted set (score = total clicks)
    // This powers the trending URLs feature with O(log N) performance
    await redis.zIncrBy('trending:urls', 1, shortId);
    
    // Optional: Store detailed click info (can be used for advanced analytics)
    // We're using Redis Streams pattern here - store in a sorted set with timestamp
    // Format: click:{shortId}:{timestamp}:{hash}
    // This allows time-based queries if needed
    
  } catch (err) {
    // Gracefully handle Redis errors - don't break the redirect
    console.warn('Failed to track click in Redis:', err.message);
  }
};

/**
 * Get total clicks for a URL
 * 
 * @param {string} shortId - The short URL identifier
 * @returns {Promise<number>} Total click count
 */
export const getTotalClicks = async (shortId) => {
  try {
    const count = await redis.get(`url:clicks:${shortId}`);
    return count ? parseInt(count, 10) : 0;
  } catch (err) {
    console.warn('Failed to get total clicks:', err.message);
    return 0;
  }
};

/**
 * Get daily clicks for a URL for the last N days
 * 
 * @param {string} shortId - The short URL identifier
 * @param {number} days - Number of days to retrieve (default: 7)
 * @returns {Promise<Array>} Array of {date, clicks} objects
 */
export const getDailyClicks = async (shortId, days = 7) => {
  try {
    const hashKey = `url:daily:${shortId}`;
    const allDays = await redis.hGetAll(hashKey);
    
    // Get last N days
    const result = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const clicks = parseInt(allDays[dateStr] || '0', 10);
      
      result.push({
        date: dateStr,
        clicks
      });
    }
    
    return result;
  } catch (err) {
    console.warn('Failed to get daily clicks:', err.message);
    return [];
  }
};

/**
 * Get top trending URLs
 * 
 * @param {number} limit - Number of top URLs to return (default: 10)
 * @returns {Promise<Array>} Array of {shortId, clicks} objects sorted by clicks descending
 */
export const getTrendingUrls = async (limit = 10) => {
  try {
    // Get top N URLs from sorted set with scores
    // ZREVRANGE returns highest scores first
    // In Redis v5, use zRange with REV: true and WITHSCORES: true
    const results = await redis.zRange('trending:urls', 0, limit - 1, {
      REV: true,
      WITHSCORES: true
    });
    
    // Results come as [value1, score1, value2, score2, ...]
    // Convert to array of objects
    const formatted = [];
    for (let i = 0; i < results.length; i += 2) {
      formatted.push({
        shortId: results[i],
        clicks: Math.round(parseFloat(results[i + 1])) // Convert score to integer
      });
    }
    
    return formatted;
  } catch (err) {
    console.warn('Failed to get trending URLs:', err.message);
    return [];
  }
};

