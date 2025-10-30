import { Injectable, Logger } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface InventoryService {
  getStock(data: { productId: number }): Observable<{ productId: number; available: number }>;
  updateStock(data: { productId: number; quantity: number }): Observable<{ success: boolean }>;
  reserveStock(data: { productId: number; quantity: number }): Observable<{ success: boolean }>;
  releaseStock(data: { productId: number; quantity: number }): Observable<{ success: boolean }>;
}

@Injectable()
export class InventoryClientService {
  private readonly logger = new Logger(InventoryClientService.name);
  private inventoryService: InventoryService;

  @Client({
    transport: 1, // Transport.GRPC
    options: {
      package: 'inventory',
      protoPath: 'src/inventory/inventory.proto',
      url: 'localhost:50051',
    },
  })
  private client: ClientGrpc;

  onModuleInit() {
    this.inventoryService = this.client.getService<InventoryService>('InventoryService');
  }

  async getStock(productId: number): Promise<{ productId: number; available: number }> {
    try {
      return await this.inventoryService.getStock({ productId }).toPromise();
    } catch (error) {
      this.logger.error(`Failed to get stock for product ${productId}`, error);
      // Return default stock if service is unavailable
      return { productId, available: 0 };
    }
  }

  async updateStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.updateStock({ productId, quantity }).toPromise();
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to update stock for product ${productId}`, error);
      return false;
    }
  }

  async reserveStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.reserveStock({ productId, quantity }).toPromise();
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to reserve stock for product ${productId}`, error);
      return false;
    }
  }

  async releaseStock(productId: number, quantity: number): Promise<boolean> {
    try {
      const result = await this.inventoryService.releaseStock({ productId, quantity }).toPromise();
      return result.success;
    } catch (error) {
      this.logger.error(`Failed to release stock for product ${productId}`, error);
      return false;
    }
  }
}
