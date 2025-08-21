import { Kafka } from 'kafkajs';
import Analytics from '../models/analyticsModel.js';

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'analytics-group' });

export const startConsumer = async () => {
	await consumer.connect();
	await consumer.subscribe({ topic: 'click-events', fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ message }) => {
			try {
				const { shortId, ip, ts, userAgent, referrer } = JSON.parse(message.value.toString());
				await Analytics.create({
					shortId,
					ip,
					userAgent,
					referrer,
					timestamp: ts ? new Date(ts) : new Date(),
				});
			} catch (err) {
				console.error('Failed processing Kafka message:', err);
			}
		},
	});
};
