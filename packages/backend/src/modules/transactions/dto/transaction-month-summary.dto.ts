import { ApiProperty } from '@silte/nestjs-swagger';
import { Allow } from 'class-validator';

class TransactionMonthSummaryIdDto {
  @ApiProperty()
  @Allow()
  year: number;

  @ApiProperty()
  @Allow()
  month: number;
}

export class TransactionMonthSummaryDto {
  @ApiProperty()
  @Allow()
  readonly _id: TransactionMonthSummaryIdDto;

  @ApiProperty()
  @Allow()
  readonly count: number;

  @ApiProperty()
  @Allow()
  readonly totalAmount: number;
}
