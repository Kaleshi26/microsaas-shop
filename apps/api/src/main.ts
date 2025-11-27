// apps/api/src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { existsSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  // markers for debugging startup flow
  // eslint-disable-next-line no-console
  console.log('bootstrap start');
  let app;
  try {
    app = await NestFactory.create(AppModule);
    // eslint-disable-next-line no-console
    console.log('nest factory created');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('error during NestFactory.create', err && err.stack ? err.stack : err);
    // rethrow so the process exits and our wrappers capture it
    throw err;
  }
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Pino logging
  app.use(
    pinoHttp({
      logger: pino({ 
        level: configService.isDevelopment ? 'debug' : 'info',
        transport: configService.isDevelopment ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        } : undefined,
      })
    })
  );

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // CORS
  app.enableCors({ 
    origin: [configService.get('CORS_ORIGIN')], 
    credentials: true 
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  const protoCandidates = [
    join(__dirname, 'inventory', 'inventory.proto'),
    join(process.cwd(), 'src', 'inventory', 'inventory.proto'),
    join(process.cwd(), 'apps', 'api', 'src', 'inventory', 'inventory.proto')
  ];
  const protoPath = protoCandidates.find((candidate) => existsSync(candidate)) ?? protoCandidates[0];
  // eslint-disable-next-line no-console
  console.log('Using inventory proto at', protoPath);

  console.log('Starting inventory microservice with proto:', protoPath);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'inventory',
      protoPath,
      url: '0.0.0.0:50051'
    }
  });

  try {
    await app.startAllMicroservices();
    console.log('Inventory microservice started');
    logger.log('gRPC InventoryService running on 0.0.0.0:50051');
  } catch (error) {
    logger.error('Failed to start inventory gRPC microservice', error as Error);
  }

  const port = configService.get('PORT');
  // eslint-disable-next-line no-console
  console.log('about to listen on port', port);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log('app.listen returned');
  logger.log(`API listening on http://localhost:${port}`);
  logger.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();

process.on('uncaughtException', (err) => {
  // Make sure unexpected errors are logged so we can debug startup failures
  // eslint-disable-next-line no-console
  console.error('uncaughtException', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('unhandledRejection', reason);
});