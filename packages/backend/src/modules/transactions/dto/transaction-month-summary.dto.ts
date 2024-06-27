import { ApiProperty } from '@nestjs/swagger';

class TransactionMonthSummaryIdDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;
}

export class TransactionMonthSummaryDto {
  @ApiProperty({ type: TransactionMonthSummaryIdDto })
  readonly id: TransactionMonthSummaryIdDto;

  @ApiProperty()
  readonly count: number;

  @ApiProperty()
  readonly totalCount: number;

  @ApiProperty()
  readonly incomesCount: number;

  @ApiProperty()
  readonly expensesCount: number;

  @ApiProperty()
  readonly transfersCount: number;

  @ApiProperty()
  readonly totalAmount: number;

  @ApiProperty()
  readonly incomeAmount: number;

  @ApiProperty()
  readonly expenseAmount: number;

  @ApiProperty()
  readonly transferAmount: number;
}
