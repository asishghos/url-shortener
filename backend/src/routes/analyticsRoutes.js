import express from 'express';
import { getTopLinks, getDailyClicks } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/top-links', getTopLinks);
router.get('/daily-clicks', getDailyClicks);

export default router;
