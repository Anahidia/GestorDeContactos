import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { MensajeRepository } from 'src/mensaje/mensaje.repository';
import { ContactRepository } from 'src/contact/contact.repository';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [
   ContactModule ,
 
  ],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
