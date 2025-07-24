// analyticsWorker.js

import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';
import Analytics from '../models/analyticsModel.js'; // Import the Analytics model
import dotenv from 'dotenv';

dotenv.config();

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  await consumer.connect();
  await consumer.subscribe({ topic: 'click-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const { shortId, ip, ts, userAgent, referrer } = JSON.parse(message.value.toString());
        console.log(`[Analytics] Processing click for ${shortId}`);

        // Create a new analytics document
        const analyticsEntry = new Analytics({
          shortId,
          ip,
          timestamp: new Date(ts),
          userAgent, // You can add these later
          referrer,  // You can add these later
        });
        
        await analyticsEntry.save();
        console.log(`[Analytics] Saved click for ${shortId}`);

      } catch (err) {
        console.error('Failed to process message:', err);
      }
    },
  });
};

run().catch(console.error);