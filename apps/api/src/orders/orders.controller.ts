import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { incHttp } from '../metrics/metrics.controller';

@Controller('/orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post('/checkout')
  async checkout(@Body() body: any) {
    const url = await this.svc.createCheckoutSession(body.items || []);
    incHttp('/orders/checkout', 'POST', 200);
    return { url };
  }
}