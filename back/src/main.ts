import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sirve archivos estáticos desde una carpeta específica
  app.use('/assets', express.static(join(__dirname, '..', 'public', 'assets')));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const PORT = process.env.PORT || 3002;
  await app.listen(PORT);
  console.log(`Server listening on port ${PORT}`);
}
bootstrap();