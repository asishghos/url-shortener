import Analytics from '../models/analyticsModel.js';

export const getTopLinks = async (req, res) => {
  const result = await Analytics.aggregate([
    { $group: { _id: "$shortId", clicks: { $sum: 1 } } },
    { $sort: { clicks: -1 } },
    { $limit: 10 }
  ]);

  res.json(result);
};

export const getDailyClicks = async (req, res) => {
  const result = await Analytics.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        },
        clicks: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);

  res.json(result);
};
