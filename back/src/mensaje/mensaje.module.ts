import { Module } from '@nestjs/common';
import { MensajeController } from './mensaje.controller';
import { MensajeService } from './mensaje.service';
import { Message } from 'src/entitys/mensaje.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeRepository } from './mensaje.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MensajeController],
  providers: [MensajeService, MensajeRepository]
})
export class MensajeModule {}
