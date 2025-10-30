import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SearchModule } from './search/search.module';
import { MetricsModule } from './metrics/metrics.module';
import { InventoryModule } from './inventory/inventory.module';
import { HealthModule } from './health/health.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductsModule,
    OrdersModule,
    SearchModule,
    MetricsModule,
    InventoryModule,
    HealthModule,
  ],
  providers: [PrismaService, ConfigService],
})
export class AppModule {}