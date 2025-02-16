import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  asunto: string;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  img?: string;
}
