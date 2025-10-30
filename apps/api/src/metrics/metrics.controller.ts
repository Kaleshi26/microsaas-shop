import { Controller, Get } from '@nestjs/common';
import client from 'prom-client';

const register = new client.Registry();

// HTTP metrics
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['route', 'method', 'status'],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['route', 'method', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Cache metrics
const cacheHits = new client.Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_type', 'key'],
});

const cacheMisses = new client.Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_type', 'key'],
});

// Search metrics
const searchRequests = new client.Counter({
  name: 'search_requests_total',
  help: 'Total search requests',
  labelNames: ['query', 'results_count'],
});

// Kafka metrics
const kafkaPublishTotal = new client.Counter({
  name: 'kafka_publish_total',
  help: 'Total Kafka publish operations',
  labelNames: ['topic', 'status'],
});

// Database metrics
const databaseConnections = new client.Gauge({
  name: 'database_connections_active',
  help: 'Active database connections',
});

// Redis metrics
const redisConnections = new client.Gauge({
  name: 'redis_connections_active',
  help: 'Active Redis connections',
});

// Register all metrics
register.registerMetric(httpRequests);
register.registerMetric(httpRequestDuration);
register.registerMetric(cacheHits);
register.registerMetric(cacheMisses);
register.registerMetric(searchRequests);
register.registerMetric(kafkaPublishTotal);
register.registerMetric(databaseConnections);
register.registerMetric(redisConnections);

// Collect default metrics
client.collectDefaultMetrics({ register });

@Controller()
export class MetricsController {
  @Get('/metrics')
  async metrics() {
    return register.metrics();
  }
}

export function incHttp(route: string, method: string, status: number) {
  httpRequests.inc({ route, method, status: String(status) });
}

export function observeHttpDuration(route: string, method: string, status: number, duration: number) {
  httpRequestDuration.observe({ route, method, status: String(status) }, duration);
}

export function incCacheHit(cacheType: string, key: string) {
  cacheHits.inc({ cache_type: cacheType, key });
}

export function incCacheMiss(cacheType: string, key: string) {
  cacheMisses.inc({ cache_type: cacheType, key });
}

export function incSearchRequest(query: string, resultsCount: number) {
  searchRequests.inc({ query, results_count: String(resultsCount) });
}

export function incKafkaPublish(topic: string, status: 'success' | 'error') {
  kafkaPublishTotal.inc({ topic, status });
}

export function setDatabaseConnections(count: number) {
  databaseConnections.set(count);
}

export function setRedisConnections(count: number) {
  redisConnections.set(count);
}