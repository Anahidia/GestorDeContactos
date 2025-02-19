import { Injectable } from '@nestjs/common';
import { ContactRepository } from './contact.repository';
import { CreateContactDto } from './dto/creteContactDto';
import { Contact } from 'src/entitys/contact.entity';
import { CreateMultipleContactsDto } from './dto/CreateMultipleContactsDto';

@Injectable()
export class ContactService {
    constructor(
        private readonly contactRepository: ContactRepository,
    ){}

    async createContactService(createContactDto: CreateContactDto): Promise<Contact> {
        return this.contactRepository.createContact(createContactDto);
    }

    async createMultipleContactService(createMultipleContactsDto: CreateMultipleContactsDto): Promise<Contact[]> {
        return this.contactRepository.createMultipleContact(createMultipleContactsDto);
    }

    async findAllContactsService(page: number = 1, pageSize: number = 10) {
        return this.contactRepository.findAllContacts(page, pageSize);
    }

    async findContactByIdService(id: string): Promise<Contact> {
        return this.contactRepository.findContactById(id);
    }
    
    async findRecentContactsService(limit: number){
        return this.contactRepository.findRecentContacts(limit);
    }
    
  async findContactByNameService(name: string) {

    return await this.contactRepository.findContactByName(name);
  }
      
    
    async removeContactService(id: string): Promise<void> {
        await this.contactRepository.removeContact(id);
    }
}
