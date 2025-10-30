import { Controller, Get, Put, Post, Param, Body, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { incHttp } from '../metrics/metrics.controller';

@Controller('/inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get(':productId')
  async getStock(@Param('productId', ParseIntPipe) productId: number) {
    const stock = await this.inventoryService.getStock(productId);
    incHttp('/inventory/:productId', 'GET', 200);
    return stock;
  }

  @Put(':productId')
  async updateStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const result = await this.inventoryService.updateStock(productId, quantity);
    incHttp('/inventory/:productId', 'PUT', 200);
    return result;
  }

  @Post(':productId/reserve')
  async reserveStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const result = await this.inventoryService.reserveStock(productId, quantity);
    incHttp('/inventory/:productId/reserve', 'POST', 200);
    return result;
  }

  @Post(':productId/release')
  async releaseStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    const result = await this.inventoryService.releaseStock(productId, quantity);
    incHttp('/inventory/:productId/release', 'POST', 200);
    return result;
  }

  @Get()
  async getAllStock() {
    const stock = await this.inventoryService.getAllStock();
    incHttp('/inventory', 'GET', 200);
    return stock;
  }
}
