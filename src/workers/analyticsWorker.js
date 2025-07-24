import { Kafka } from 'kafkajs';
import { connect } from 'mongoose';
import { findOneAndUpdate } from '../models/urlModel';

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });

const run = async () => {
  await connect(process.env.MONGO_URL);
  await consumer.connect();
  await consumer.subscribe({ topic: 'click-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { shortId, ip, ts } = JSON.parse(message.value.toString());
      console.log(`[Analytics] ${shortId} clicked by ${ip} @ ${new Date(ts)}`);
      await findOneAndUpdate({ shortId }, { $inc: { clicks: 1 } });
      // Optionally log to a separate `clickLogs` collection
    }
  });
};

run().catch(console.error);
