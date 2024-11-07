import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsDate, ValidateNested } from 'class-validator';

import { TransactionListItem } from './transaction-list-item.dto';

export class TransactionListGroupDto<DataType = TransactionListItem> {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ValidateNested({ each: true })
  @Allow()
  data: DataType[];
}
