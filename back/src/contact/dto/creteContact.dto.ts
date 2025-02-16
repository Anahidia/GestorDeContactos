import { IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  number: string;
}
