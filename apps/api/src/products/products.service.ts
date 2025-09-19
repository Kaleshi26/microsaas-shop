
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { redis } from '../common/redis';
import { osClient } from '../common/opensearch';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const cacheKey = 'products:all';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const products = await this.prisma.product.findMany({ orderBy: { id: 'asc' } });
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
    return products;
  }

  async upsertIndex() {
    const products = await this.prisma.product.findMany();
    for (const p of products) {
      await osClient.index({
        index: 'products',
        id: String(p.id),
        body: { name: p.name, description: p.description, priceCents: p.priceCents, imageUrl: p.imageUrl }
      });
    }
    await osClient.indices.refresh({ index: 'products' });
  }
}