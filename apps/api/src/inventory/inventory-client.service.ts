import { Injectable, Logger } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Injectable()
export class InventoryClientService {
  private readonly logger = new Logger(InventoryClientService.name);

  constructor(private readonly inventoryService: InventoryService) {}

  async getStock(productId: number): Promise<{ productId: number; available: number }> {
    try {
      return await this.inventoryService.getStock(productId);
    } catch (error) {
      this.logger.error(`Failed to get stock for product ${productId}`, error);
      return { productId, available: 0 };
    }
  }

  async updateStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.updateStock(productId, quantity);
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to update stock for product ${productId}`, error);
      return false;
    }
  }

  async reserveStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.reserveStock(productId, quantity);
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to reserve stock for product ${productId}`, error);
      return false;
    }
  }

  async releaseStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.releaseStock(productId, quantity);
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to release stock for product ${productId}`, error);
      return false;
    }
  }
}
