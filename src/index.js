import express from 'express';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import Url from './models/urlModel.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import redis from './config/redis.js';
import connectDB from './config/db.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use('/api', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const cacheKey = `url:${shortId}`;

  let longUrl = await redis.get(cacheKey);

  if (longUrl) {
    // console.log("working");
    return res.redirect(longUrl);
  }
  const entry = await Url.findOne({ shortId });

  if (entry) {
    await redis.set(cacheKey, entry.longUrl, { EX: 3600 });
    entry.clicks += 1;
    await entry.save();
    return res.redirect(entry.longUrl);
  } else {
    return res.status(404).send('Short URL not found');
  }
});


const startServer = async () => {
  try {
    await connectDB(); // wait for DB

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
