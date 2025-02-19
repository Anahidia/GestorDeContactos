import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Contact } from "src/entitys/contact.entity";
import { Repository } from "typeorm";
import { CreateContactDto } from "./dto/creteContactDto";
import { CreateMultipleContactsDto } from "./dto/CreateMultipleContactsDto";

@Injectable()
export class ContactRepository {

    
    constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    ) {}

    async createContact(createContactDto: CreateContactDto): Promise<Contact> {
        const contact = this.contactRepository.create(createContactDto);
        return await this.contactRepository.save(contact);
      }
      
      async createMultipleContact(createMultipleContactsDto: CreateMultipleContactsDto): Promise<Contact[]> {
        const contacts = this.contactRepository.create(createMultipleContactsDto.contacts);
        return await this.contactRepository.save(contacts);
      }

      async findAllContacts(page: number = 1, pageSize: number = 10) {
        const [contacts, total] = await this.contactRepository.findAndCount({
          take: pageSize,
          skip: (page - 1) * pageSize,
        });
      
        const totalPages = Math.ceil(total / pageSize);
      
       
        const prevPage = page > 1 ? page - 1 : null; 
        const nextPage = page < totalPages ? page + 1 : null;  
      
        return {
          contacts,
          total,
          totalPages,
          prevPage,
          nextPage,
        };
      }
      
    
      async findContactById(id: string): Promise<Contact> {
        const contact = await this.contactRepository.findOne({ where: { id } });
        if (!contact) {
          throw new NotFoundException(`Contact with ID ${id} not found`);
        }
        return contact;
      }

      async findRecentContacts(limit: number) {
        return this.contactRepository.find({
          order: {
            created_at: 'DESC', 
            name: 'ASC', 
          },
          take: limit,
        });
      }

      async findContactByName(name: string) {
        return this.contactRepository.findOne({
          where: {
            name: name,
          },
        });
      }
      
    
      async removeContact(id: string): Promise<void> {
        const result = await this.contactRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Contact with ID ${id} not found`);
        }
    }
    
}