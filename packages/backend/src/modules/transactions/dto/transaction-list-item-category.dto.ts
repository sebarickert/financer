import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class TransactionListItemCategoryDto {
  constructor(data?: TransactionListItemCategoryDto) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
    }
  }

  @ApiProperty()
  @IsUUID()
  id!: string;

  @ApiProperty()
  @IsString()
  name!: string;
}
