const { Kafka } = require('kafkajs');
const kafka = new Kafka({ brokers: ['localhost:9092'] });
const producer = kafka.producer();

const initProducer = async () => await producer.connect();

const sendClickEvent = async (shortId, ip) => {
  await producer.send({
    topic: 'click-events',
    messages: [{ value: JSON.stringify({ shortId, ip, ts: Date.now() }) }]
  });
};

module.exports = { initProducer, sendClickEvent };
