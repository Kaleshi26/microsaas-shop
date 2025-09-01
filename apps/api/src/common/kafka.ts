import { Kafka } from 'kafkajs';

const broker = process.env.KAFKA_BROKER || 'localhost:19092';
export const kafka = new Kafka({ clientId: 'microsaas-api', brokers: [broker] });
export const producer = kafka.producer();

export async function ensureKafka() {
  await producer.connect();
}