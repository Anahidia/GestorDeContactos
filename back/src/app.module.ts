import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { MensajeModule } from './mensaje/mensaje.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import typeorm from './config/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env', // Archivo de entorno
      load: [typeorm], // Cargar configuración personalizada
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options = configService.get<TypeOrmModuleOptions>('typeorm') || {};
        return options;
      },
    }),
    ContactModule, MensajeModule, SeedersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
