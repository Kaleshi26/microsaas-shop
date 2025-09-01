import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.use(
    pinoHttp({
      logger: pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' })
    })
  );

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });

  await app.listen(3001);
  console.log(`API listening on http://localhost:3001`);
}
bootstrap();