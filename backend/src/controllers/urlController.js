// controllers/urlController.js
import Url from '../models/urlModel.js';
import { generateShortId } from '../utils/shortener.js';

// Validate URL format
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const shortenUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, expiresAt } = req.body;
    
    if (!longUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    if (!isValidUrl(longUrl)) {
      return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    // Validate custom alias if provided
    if (customAlias) {
      if (!/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
        return res.status(400).json({ error: 'Custom alias can only contain letters, numbers, hyphens, and underscores' });
      }
      if (customAlias.length < 3 || customAlias.length > 20) {
        return res.status(400).json({ error: 'Custom alias must be between 3 and 20 characters' });
      }
      
      const existingUrl = await Url.findOne({ shortId: customAlias });
      if (existingUrl) {
        return res.status(409).json({ error: 'Custom alias is already in use.' });
      }
    }

    // Validate expiration date if provided
    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        return res.status(400).json({ error: 'Invalid expiration date. It must be in the future.' });
      }
    }

    let shortId = customAlias || generateShortId();
    
    // Ensure shortId is unique (in case of collision)
    let attempts = 0;
    while (attempts < 10) {
      const existing = await Url.findOne({ shortId });
      if (!existing) break;
      shortId = generateShortId();
      attempts++;
    }

    if (attempts >= 10) {
      return res.status(500).json({ error: 'Failed to generate unique short ID. Please try again.' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const shortUrl = `${baseUrl}/${shortId}`;

    const url = new Url({
      shortId,
      longUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });
    
    await url.save();

    res.status(201).json({ 
      shortUrl, 
      shortId,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};

export default shortenUrl;