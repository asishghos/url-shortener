import { getTrendingUrls, getDailyClicks as getDailyClicksFromRedis } from '../services/analyticsService.js';
import Url from '../models/urlModel.js';

/**
 * Get top trending URLs
 * Uses Redis Sorted Sets for O(log N) performance
 */
export const getTopLinks = async (req, res) => {
  try {
    // Get trending URLs from Redis sorted set
    const trending = await getTrendingUrls(10);

    // Join with Url model to get longUrl and metadata
    const topLinks = await Promise.all(
      trending.map(async (item) => {
        const urlDoc = await Url.findOne({ shortId: item.shortId });
        if (urlDoc) {
          return {
            shortId: item.shortId,
            shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${item.shortId}`,
            longUrl: urlDoc.longUrl,
            clicks: item.clicks,
            createdAt: urlDoc.createdAt
          };
        }
        return {
          shortId: item.shortId,
          shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${item.shortId}`,
          longUrl: 'N/A',
          clicks: item.clicks
        };
      })
    );

    res.json(topLinks);
  } catch (error) {
    console.error('Error fetching top links:', error);
    res.status(500).json({ error: 'Failed to fetch top links' });
  }
};

/**
 * Get daily clicks analytics
 * Uses Redis Hashes for efficient daily click tracking
 * 
 * Query params:
 * - shortId: (optional) Get clicks for specific URL. If not provided, returns aggregated daily clicks
 * - days: (optional) Number of days to retrieve (default: 7)
 */
export const getDailyClicks = async (req, res) => {
  try {
    const { shortId, days = 7 } = req.query;
    
    if (shortId) {
      // Get daily clicks for a specific URL
      const result = await getDailyClicksFromRedis(shortId, parseInt(days, 10));
      res.json(result.map(item => ({
        _id: { date: item.date },
        clicks: item.clicks
      })));
    } else {
      // Aggregate daily clicks across all URLs
      // This would require iterating through all URL keys or using a separate Redis structure
      // For now, return empty array if no shortId provided
      // In production, you might want to maintain a separate aggregated daily clicks key
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching daily clicks:', error);
    res.status(500).json({ error: 'Failed to fetch daily clicks' });
  }
};
