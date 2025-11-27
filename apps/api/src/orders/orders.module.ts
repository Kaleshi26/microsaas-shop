import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryClientService } from '../inventory/inventory-client.service';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  providers: [OrdersService, PrismaService, InventoryClientService],
  controllers: [OrdersController]
})
export class OrdersModule {}