import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  case: string;

  @IsNotEmpty()
  text: string;

  @IsOptional()
  img?: string;
}
