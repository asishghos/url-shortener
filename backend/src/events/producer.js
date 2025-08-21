import { Kafka } from 'kafkajs';
const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const producer = kafka.producer();

export const initProducer = async () => await producer.connect();

export const sendClickEvent = async (shortId, ip, userAgent, referrer) => {
	await producer.send({
		topic: 'click-events',
		messages: [{ value: JSON.stringify({ shortId, ip, ts: Date.now(), userAgent, referrer }) }],
	});
};

