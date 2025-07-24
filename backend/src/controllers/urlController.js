// controllers/urlController.js
import Url from '../models/urlModel.js';
import { generateShortId } from '../utils/shortener.js';

const shortenUrl = async (req, res) => {
  const { longUrl, customAlias, expiresAt } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let shortId;

  if (customAlias) {
    const existingUrl = await Url.findOne({ shortId: customAlias });
    if (existingUrl) {
      return res.status(409).json({ error: 'Custom alias is already in use.' });
    }
    shortId = customAlias;
  } else {
    shortId = generateShortId();
  }

  const shortUrl = `${process.env.BASE_URL}/${shortId}`;

  const url = new Url({
    shortId,
    longUrl,
    expiresAt: expiresAt ? new Date(expiresAt) : null
  });
  
  await url.save();

  res.status(201).json({ shortUrl, expiresAt: url.expiresAt });
};

export default shortenUrl;