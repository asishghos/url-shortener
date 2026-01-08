import express from "express";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import Url from "./models/urlModel.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import redis from "./config/redis.js";
import connectDB from "./config/db.js";
import cors from "cors";
import { trackClick } from "./services/analyticsService.js";

dotenv.config();
const app = express();

// Trust proxy to get correct IP and protocol headers (needed for Render, Heroku, etc.)
app.set('trust proxy', true);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Redirect route - must be last to avoid conflicts with API routes
app.get("/:shortId", async (req, res) => {
  // Exclude common paths that shouldn't be treated as shortIds
  const excludedPaths = ['api', 'health', 'favicon.ico'];
  if (excludedPaths.includes(req.params.shortId)) {
    return res.status(404).send("Not found");
  }
  const { shortId } = req.params;
  const cacheKey = `url:${shortId}`;

  try {
    let longUrl = await redis.get(cacheKey);

    if (longUrl) {
      // still record analytics even if served from cache
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      await trackClick(shortId, ip, { userAgent: req.headers['user-agent'], referrer: req.get('referer') });
      return res.redirect(longUrl);
    }

    const entry = await Url.findOne({ shortId });

    if (entry) {
      if (entry.expiresAt && entry.expiresAt < new Date()) {
        await redis.del(cacheKey);
        await Url.deleteOne({ shortId });
        return res
          .status(410)
          .send("This link has expired and is no longer available.");
      }
      await redis.set(cacheKey, entry.longUrl, { EX: 3600 });
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      await trackClick(shortId, ip, { userAgent: req.headers['user-agent'], referrer: req.get('referer') });
      return res.redirect(entry.longUrl);
    } else {
      return res.status(404).send("Short URL not found");
    }
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Server Error");
  }
});

const startServer = async () => {
  try {
    await connectDB();

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
