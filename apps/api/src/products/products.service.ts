import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { redis } from '../common/redis';
import { osClient } from '../common/opensearch';
import { InventoryClientService } from '../inventory/inventory-client.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private inventoryClient: InventoryClientService,
  ) {}

  async list(): Promise<ProductResponseDto[]> {
    const cacheKey = 'products:all';
    const cached = await redis.get(cacheKey);
    if (cached) {
      const products = JSON.parse(cached);
      // Add stock information
      const productsWithStock = await Promise.all(
        products.map(async (product: any) => ({
          ...product,
          available: (await this.inventoryClient.getStock(product.id)).available,
        }))
      );
      return productsWithStock;
    }

    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    // Add stock information
    const productsWithStock = await Promise.all(
      products.map(async (product) => ({
        ...product,
        available: (await this.inventoryClient.getStock(product.id)).available,
      }))
    );

    await redis.set(cacheKey, JSON.stringify(productsWithStock), 'EX', 60);
    return productsWithStock;
  }

  async findById(id: number): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const stock = await this.inventoryClient.getStock(id);
    return {
      ...product,
      available: stock.available,
    };
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    // Initialize stock in inventory service
    await this.inventoryClient.updateStock(product.id, 10); // Default stock

    // Clear cache
    await redis.del('products:all');

    // Add to search index
    await this.addToSearchIndex(product);

    const stock = await this.inventoryClient.getStock(product.id);
    return {
      ...product,
      available: stock.available,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Clear cache
    await redis.del('products:all');

    // Update search index
    await this.addToSearchIndex(product);

    const stock = await this.inventoryClient.getStock(id);
    return {
      ...product,
      available: stock.available,
    };
  }

  async remove(id: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    // Clear cache
    await redis.del('products:all');

    // Remove from search index
    await osClient.delete({
      index: 'products',
      id: String(id),
    });
  }

  async createProductIndex(): Promise<void> {
    try {
      const indexExists = await osClient.indices.exists({ index: 'products' });
      
      if (!indexExists) {
        await osClient.indices.create({
          index: 'products',
          body: {
            mappings: {
              properties: {
                name: { type: 'text', analyzer: 'standard' },
                description: { type: 'text', analyzer: 'standard' },
                priceCents: { type: 'integer' },
                imageUrl: { type: 'keyword' },
                category: { type: 'keyword' },
                sku: { type: 'keyword' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'date' },
              },
            },
          },
        });
        this.logger.log('Created products index in OpenSearch');
      }
    } catch (error) {
      this.logger.error('Failed to create products index', error);
      throw error;
    }
  }

  async upsertIndex(): Promise<void> {
    await this.createProductIndex();
    
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
    });

    for (const product of products) {
      await this.addToSearchIndex(product);
    }

    await osClient.indices.refresh({ index: 'products' });
    this.logger.log(`Indexed ${products.length} products to OpenSearch`);
  }

  private async addToSearchIndex(product: any): Promise<void> {
    try {
      await osClient.index({
        index: 'products',
        id: String(product.id),
        body: {
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          category: product.category,
          sku: product.sku,
          isActive: product.isActive,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}`, error);
    }
  }
}