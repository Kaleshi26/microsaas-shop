import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
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

  const port = configService.get('PORT');
  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}`);
  logger.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();