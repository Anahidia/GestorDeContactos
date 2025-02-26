import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from 'src/entitys/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRepository } from './contact.repository';
import { SeedersService } from 'src/seeders/seeders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactController],
  providers: [ContactService, ContactRepository ],
  exports: [ContactRepository]
})
export class ContactModule {}
