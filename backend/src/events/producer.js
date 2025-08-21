import { producer } from '../config/kafka.js';

const analyticsEnabled = process.env.ENABLE_ANALYTICS === 'true';
let kafkaReady = false;

export const initProducer = async () => {
  if (!analyticsEnabled) {
    console.info('Analytics disabled. Set ENABLE_ANALYTICS=true to enable Kafka.');
    return;
  }
  try {
    await producer.connect();
    kafkaReady = true;
    console.log('⚡ Kafka producer connected');
  } catch (err) {
    kafkaReady = false;
    console.warn('Kafka unavailable. Continuing without analytics. Reason:', err.message);
  }
};

export const sendClickEvent = async (shortId, ip, meta = {}) => {
  if (!analyticsEnabled || !kafkaReady) return; // no-op when Kafka is down or disabled
  const payload = { shortId, ip, ts: Date.now(), ...meta };
  try {
    await producer.send({
      topic: 'click-events',
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (err) {
    console.warn('Failed to send Kafka event:', err.message);
  }
};

