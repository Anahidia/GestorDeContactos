import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/creteContactDto';
import { CreateMultipleContactsDto } from './dto/CreateMultipleContactsDto';

@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
    ){}

    @Post()
    create(@Body() createContactDto: CreateContactDto) {
      return this.contactService.createContactService(createContactDto);
    }

    @Post('multiple')
    createMultiple(@Body() createMultipleContactsDto: CreateMultipleContactsDto) {
      return this.contactService.createMultipleContactService(createMultipleContactsDto);
    }
    
    @Get()
    async findAll(
      @Query('page') page: number = 1,  
      @Query('pageSize') pageSize: number = 10,  
    ) {
      const result = await this.contactService.findAllContactsService(page, pageSize);
      return result;
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.contactService.findContactByIdService(id);
    }
    
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.contactService.removeContactService(id);
    }
}
