import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateContactDto } from './creteContactDto';


export class CreateMultipleContactsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts: CreateContactDto[];
}
