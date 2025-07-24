import express from 'express';
import shortenUrl  from '../controllers/urlController.js';
import rateLimiter from '../utils/rateLimiter.js';
const router = express.Router();

router.post('/shorten',rateLimiter(10, 60), shortenUrl);

export default router;

