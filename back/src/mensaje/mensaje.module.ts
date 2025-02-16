import { Module } from '@nestjs/common';
import { MensajeController } from './mensaje.controller';
import { MensajeService } from './mensaje.service';

@Module({
  controllers: [MensajeController],
  providers: [MensajeService]
})
export class MensajeModule {}
