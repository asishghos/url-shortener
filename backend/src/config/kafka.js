import { Kafka, Partitioners } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'url-shortener',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
