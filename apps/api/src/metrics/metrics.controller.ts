import { Controller, Get } from '@nestjs/common';
import client from 'prom-client';

const register = new client.Registry();
const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['route', 'method', 'status']
});
register.registerMetric(httpRequests);
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