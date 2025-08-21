import { producer } from '../config/kafka.js';

let kafkaReady = false;

export const initProducer = async () => {
  try {
    await producer.connect();
    kafkaReady = true;
    console.log('⚡ Kafka producer connected');
  } catch (err) {
    kafkaReady = false;
    console.warn('Kafka unavailable. Continuing without analytics. Reason:', err.message);
  }
};

export const sendClickEvent = async (shortId, ip, extra = {}) => {
  if (!kafkaReady) return; // no-op when Kafka is down
  const payload = { shortId, ip, ts: Date.now(), ...extra };
  try {
    await producer.send({
      topic: 'click-events',
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (err) {
    console.warn('Failed to send Kafka event:', err.message);
  }
};

