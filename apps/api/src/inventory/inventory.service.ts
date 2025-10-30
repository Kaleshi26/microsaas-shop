import { Injectable, Logger } from '@nestjs/common';

interface StockData {
  productId: number;
  available: number;
  reserved: number;
  total: number;
}

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);
  private stock: Map<number, StockData> = new Map();

  constructor() {
    // Initialize with some default stock
    this.initializeDefaultStock();
  }

  private initializeDefaultStock() {
    // Initialize stock for products 1-10
    for (let i = 1; i <= 10; i++) {
      this.stock.set(i, {
        productId: i,
        available: (i % 5) + 1,
        reserved: 0,
        total: (i % 5) + 1,
      });
    }
  }

  async getStock(productId: number): Promise<{ productId: number; available: number }> {
    const stock = this.stock.get(productId);
    if (!stock) {
      this.logger.warn(`No stock data found for product ${productId}`);
      return { productId, available: 0 };
    }
    return { productId, available: stock.available };
  }

  async updateStock(productId: number, quantity: number): Promise<{ success: boolean }> {
    try {
      const currentStock = this.stock.get(productId) || {
        productId,
        available: 0,
        reserved: 0,
        total: 0,
      };

      currentStock.total = quantity;
      currentStock.available = quantity - currentStock.reserved;
      
      if (currentStock.available < 0) {
        this.logger.warn(`Cannot set total stock below reserved for product ${productId}`);
        return { success: false };
      }

      this.stock.set(productId, currentStock);
      this.logger.log(`Updated stock for product ${productId}: ${quantity} total, ${currentStock.available} available`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to update stock for product ${productId}`, error);
      return { success: false };
    }
  }

  async reserveStock(productId: number, quantity: number): Promise<{ success: boolean }> {
    try {
      const stock = this.stock.get(productId);
      if (!stock) {
        this.logger.warn(`No stock data found for product ${productId}`);
        return { success: false };
      }

      if (stock.available < quantity) {
        this.logger.warn(`Insufficient stock for product ${productId}: requested ${quantity}, available ${stock.available}`);
        return { success: false };
      }

      stock.available -= quantity;
      stock.reserved += quantity;
      this.stock.set(productId, stock);

      this.logger.log(`Reserved ${quantity} units for product ${productId}. Available: ${stock.available}, Reserved: ${stock.reserved}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to reserve stock for product ${productId}`, error);
      return { success: false };
    }
  }

  async releaseStock(productId: number, quantity: number): Promise<{ success: boolean }> {
    try {
      const stock = this.stock.get(productId);
      if (!stock) {
        this.logger.warn(`No stock data found for product ${productId}`);
        return { success: false };
      }

      if (stock.reserved < quantity) {
        this.logger.warn(`Cannot release more stock than reserved for product ${productId}: requested ${quantity}, reserved ${stock.reserved}`);
        return { success: false };
      }

      stock.available += quantity;
      stock.reserved -= quantity;
      this.stock.set(productId, stock);

      this.logger.log(`Released ${quantity} units for product ${productId}. Available: ${stock.available}, Reserved: ${stock.reserved}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to release stock for product ${productId}`, error);
      return { success: false };
    }
  }

  async getAllStock(): Promise<StockData[]> {
    return Array.from(this.stock.values());
  }
}