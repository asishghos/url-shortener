// models/urlModel.js
import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null, index: true }
});

export default mongoose.model('Url', urlSchema);