import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMessageDto } from './dto/createMensaje.dto';

@Controller('mensaje')
export class MensajeController {
    constructor(
        private readonly mensajeService: MensajeService
    ) {}

    @Get()
    getMensajes() {
        return this.mensajeService.getMensajesService();
    }
    
    @Get(':id')
    getMensajeById(@Param('id') id: string) {
        return this.mensajeService.getMensajeServiceById(id);
    }
    
    @Get('asunto/:asunto')
    getMensajeByAsunto(@Param('asunto') asunto: string) {
        return this.mensajeService.getMensajeServiceByAsunto(asunto);
    }
    
    @Post()
    createMensaje(@Body() mesaje:CreateMessageDto) {
        return this.mensajeService.createMensajeService(mesaje);
    }
    
    @Put(':id')
    updateMensaje(@Param('id') id: string, @Body() data: any) {
        return this.mensajeService.updateMensajeService(id, data);
    }
    
    @Delete(':id')
    deleteMensaje(@Param('id') id: string) {
        return this.mensajeService.deleteMensajeService(id);
    }
}
