import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { SeedersService } from './seeders/seeders.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeders=app.get(SeedersService)
  await seeders.addSerders()
  
  app.enableCors()
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`server lisent in port ${PORT}`);
}
bootstrap();
