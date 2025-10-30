import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const configSchema = z.object({
  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/microsaas'),
  
  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  
  // OpenSearch
  OPENSEARCH_URL: z.string().default('http://localhost:9200'),
  OPENSEARCH_USERNAME: z.string().optional(),
  OPENSEARCH_PASSWORD: z.string().optional(),
  
  // Kafka
  KAFKA_BROKER: z.string().default('localhost:19092'),
  
  // Stripe
  STRIPE_SECRET_KEY: z.string().default('sk_test_51234567890'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Unleash
  UNLEASH_URL: z.string().default('http://localhost:4242/api'),
  UNLEASH_API_TOKEN: z.string().default('default:dev.token'),
  
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export type Config = z.infer<typeof configSchema>;

@Injectable()
export class ConfigService {
  private readonly config: Config;

  constructor() {
    this.config = configSchema.parse(process.env);
  }

  get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  get all(): Config {
    return this.config;
  }

  get isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  get isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  get isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}
