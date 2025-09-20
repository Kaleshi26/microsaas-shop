// apps/api/src/products/products.controller.ts
import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { incHttp } from '../metrics/metrics.controller';

@Controller('/products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get()
  async list() {
    const res = await this.svc.list();
    incHttp('/products', 'GET', 200);
    return res;
  }

  @Post('/reindex')
  @HttpCode(204)
  async reindex() {
    await this.svc.upsertIndex();
    incHttp('/products/reindex', 'POST', 204);
    return;
  }
}