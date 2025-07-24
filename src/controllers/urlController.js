import Url from '../models/urlModel.js';
import { generateShortId } from '../utils/shortener.js';

const shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: 'URL is required' });

  const shortId = generateShortId();
  const shortUrl = `${process.env.BASE_URL}/${shortId}`;

  const url = new Url({ shortId, longUrl });
  await url.save();

  res.status(201).json({ shortUrl });
};

export default shortenUrl;
