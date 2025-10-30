import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { redis } from '../common/redis';
import { osClient } from '../common/opensearch';
import { producer } from '../common/kafka';

@Controller('/health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async health() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkOpenSearch(),
      this.checkKafka(),
    ]);

    const results = checks.map((check, index) => {
      const service = ['database', 'redis', 'opensearch', 'kafka'][index];
      return {
        service,
        status: check.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        error: check.status === 'rejected' ? check.reason?.message : undefined,
      };
    });

    const allHealthy = results.every(r => r.status === 'healthy');
    const status = allHealthy ? 'healthy' : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      checks: results,
    };
  }

  @Get('/ready')
  async readiness() {
    const dbHealthy = await this.checkDatabase();
    return {
      status: dbHealthy ? 'ready' : 'not ready',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/live')
  liveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      return await this.prisma.isHealthy();
    } catch (error) {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await redis.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async checkOpenSearch(): Promise<boolean> {
    try {
      await osClient.cluster.health();
      return true;
    } catch (error) {
      return false;
    }
  }

  private async checkKafka(): Promise<boolean> {
    try {
      await producer.connect();
      return true;
    } catch (error) {
      return false;
    }
  }
}
