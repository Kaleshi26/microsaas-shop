import { Module, OnModuleInit } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
import { NestFactory } from '@nestjs/core';

@Module({ providers: [InventoryService] })
export class InventoryModule implements OnModuleInit {
  async onModuleInit() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>({}, {
      transport: Transport.GRPC,
      options: {
        package: 'inventory',
        protoPath: 'src/inventory/inventory.proto',
        url: '0.0.0.0:50051'
      }
    } as any);
    await app.listen();
    console.log('gRPC InventoryService running on 0.0.0.0:50051');
  }
}