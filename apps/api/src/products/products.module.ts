import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryClientService } from '../inventory/inventory-client.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql'
    })
  ],
  providers: [ProductsService, PrismaService, InventoryClientService, ProductsResolver],
  controllers: [ProductsController]
})
export class ProductsModule {}