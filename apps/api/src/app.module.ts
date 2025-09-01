import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SearchModule } from './search/search.module';
import { MetricsModule } from './metrics/metrics.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [ProductsModule, OrdersModule, SearchModule, MetricsModule, InventoryModule]
})
export class AppModule {}