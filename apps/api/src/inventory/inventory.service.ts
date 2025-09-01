import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
  async getStock(productId: number) {
    // toy static stock
    return { productId, available: (productId % 5) + 1 };
  }
}