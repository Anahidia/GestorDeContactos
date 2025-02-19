import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "src/entitys/mensaje.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/createMensaje.dto";

@Injectable()
export class MensajeRepository {
constructor(
    @InjectRepository(Message)
    private readonly mensajeRepository: Repository<Message>,
    
    
) {}

async createMessage(message:CreateMessageDto): Promise<Message> {
    const mensaje = this.mensajeRepository.create(message);
    return await this.mensajeRepository.save(mensaje);

}

async getAllMessages(): Promise<Message[]> {
    return await this.mensajeRepository.find();
}

async getMessageById(id: string) {
    return await this.mensajeRepository.findOne({where: {id}});
}

async getMessageByAsunto(asunto: string) {
    return await this.mensajeRepository.find({where: {asunto}});
}

async updateMessage(id: string, message: Message) {
    await this.mensajeRepository.update({id}, message);
    return await this.getMessageById(id);
}

async deleteMessage(id: string) {
    return await this.mensajeRepository.delete({id});

}

}
