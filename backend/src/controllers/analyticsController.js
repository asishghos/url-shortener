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
    const numDays = parseInt(days, 10);
    
    if (shortId) {
      // Get daily clicks for a specific URL
      const result = await getDailyClicksFromRedis(shortId, numDays);
      res.json(result.map(item => ({
        _id: { date: item.date },
        clicks: item.clicks
      })));
    } else {
      // Aggregate daily clicks across all URLs
      // Get all URLs from database
      const allUrls = await Url.find({}, 'shortId').lean();
      
      // Initialize aggregation map for the last N days
      const today = new Date();
      const aggregatedClicks = {};
      
      for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        aggregatedClicks[dateStr] = 0;
      }
      
      // Get daily clicks for each URL and aggregate
      for (const url of allUrls) {
        const dailyClicks = await getDailyClicksFromRedis(url.shortId, numDays);
        for (const dayData of dailyClicks) {
          if (aggregatedClicks.hasOwnProperty(dayData.date)) {
            aggregatedClicks[dayData.date] += dayData.clicks;
          }
        }
      }
      
      // Convert to array format matching the expected response
      const result = Object.keys(aggregatedClicks).map(date => ({
        _id: { date },
        clicks: aggregatedClicks[date]
      })).sort((a, b) => new Date(a._id.date) - new Date(b._id.date));
      
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching daily clicks:', error);
    res.status(500).json({ error: 'Failed to fetch daily clicks' });
  }
};
