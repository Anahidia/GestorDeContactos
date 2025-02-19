import { Injectable } from '@nestjs/common';
import { MensajeRepository } from './mensaje.repository';
import { CreateMessageDto } from './dto/createMensaje.dto';

@Injectable()
export class MensajeService {
    constructor(
        private readonly mensajeRepository: MensajeRepository
    ) {}

    async getMensajesService() {
        return await this.mensajeRepository.getAllMessages();
    }
    async getMensajeServiceById(id: string) {
        return await this.mensajeRepository.getMessageById(id);
    }

    async createMensajeService(mensaje:CreateMessageDto) {
        return await this.mensajeRepository.createMessage(mensaje);
    }
    async updateMensajeService(id: string, data: any) {
        return await this.mensajeRepository.updateMessage(id, data);
    }
    async deleteMensajeService(id: string) {
        return await this.mensajeRepository.deleteMessage(id);
    }
    async getMensajeServiceByAsunto(asunto: string) {
        return await this.mensajeRepository.getMessageByAsunto(asunto);
    }
    
}