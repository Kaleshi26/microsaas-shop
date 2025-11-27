import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryClientService } from './inventory-client.service';

@Module({
  providers: [InventoryService, InventoryClientService],
  controllers: [InventoryController],
  exports: [InventoryService]
})
export class InventoryModule {}