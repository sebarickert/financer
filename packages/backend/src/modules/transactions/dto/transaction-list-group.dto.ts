import { ApiProperty } from '@nestjs/swagger';
import { IsDate, ValidateNested } from 'class-validator';

import { TransactionListItemDto } from './transaction-list-item.dto';

export class TransactionListGroupDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @ValidateNested({ each: true })
  data: TransactionListItemDto[];
}
