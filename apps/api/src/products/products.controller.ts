import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { incHttp } from '../metrics/metrics.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('/products')
export class ProductsController {
  constructor(private svc: ProductsService) {}

  @Get()
  async list() {
    const res = await this.svc.list();
    incHttp('/products', 'GET', 200);
    return res;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const res = await this.svc.findById(id);
    incHttp('/products/:id', 'GET', 200);
    return res;
  }

  @Post()
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    const res = await this.svc.create(createProductDto);
    incHttp('/products', 'POST', 201);
    return res;
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    const res = await this.svc.update(id, updateProductDto);
    incHttp('/products/:id', 'PUT', 200);
    return res;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.svc.remove(id);
    incHttp('/products/:id', 'DELETE', 204);
  }

  @Post('/reindex')
  @HttpCode(204)
  async reindex() {
    await this.svc.upsertIndex();
    incHttp('/products/reindex', 'POST', 204);
  }
}