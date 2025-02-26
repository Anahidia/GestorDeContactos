import { Injectable } from '@nestjs/common';
import { ContactRepository } from 'src/contact/contact.repository';
import { MensajeRepository } from 'src/mensaje/mensaje.repository';

@Injectable()
export class SeedersService {
    constructor(
        private readonly contactsRepository:ContactRepository,
       
    ){}

    async addSerders(){
        console.log('add contacts')
        await this.contactsRepository.seederContact()
    }
}
