import { Body, Controller, Post, Get, Param, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { incHttp } from '../metrics/metrics.controller';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('/orders')
export class OrdersController {
  constructor(private svc: OrdersService) {}

  @Post()
  async create(@Body(ValidationPipe) createOrderDto: CreateOrderDto) {
    const result = await this.svc.create(createOrderDto);
    incHttp('/orders', 'POST', 201);
    return result;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const order = await this.svc.findById(id);
    incHttp('/orders/:id', 'GET', 200);
    return order;
  }

  @Get()
  async findByEmail(@Query('email') email: string) {
    if (!email) {
      throw new Error('Email query parameter is required');
    }
    const orders = await this.svc.findByEmail(email);
    incHttp('/orders', 'GET', 200);
    return orders;
  }

  @Post('/checkout')
  async checkout(@Body() body: any) {
    const url = await this.svc.createCheckoutSession(body.items || []);
    incHttp('/orders/checkout', 'POST', 200);
    return { url };
  }
}