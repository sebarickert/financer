import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class TransactionMonthSummaryDto {
  @ApiProperty()
  @Allow()
  readonly _id: {
    year: number;
    month: number;
  };

  @ApiProperty()
  @Allow()
  readonly count: number;

  @ApiProperty()
  @Allow()
  readonly totalAmount: number;
}
