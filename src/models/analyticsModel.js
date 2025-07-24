import { Schema, model } from 'mongoose';

const analyticsSchema = new Schema({
  shortId: {
    type: String,
    required: true,
    index: true,
  },
  ip: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  referrer: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

export default model('Analytics', analyticsSchema);
