import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private _connected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this._connected = true;
      this.logger.log('Database connected successfully');
    } catch (error) {
      this._connected = false;
      this.logger.error('Failed to connect to database (continuing without DB)', error);
    }
  }

  async onModuleDestroy() {
    try {
      if (this._connected) {
        await this.$disconnect();
        this.logger.log('Database disconnected successfully');
      }
    } catch (error) {
      this.logger.error('Error disconnecting from database', error);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this._connected) return false;
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }
}