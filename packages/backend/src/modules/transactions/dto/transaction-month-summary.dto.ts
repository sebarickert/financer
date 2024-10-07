import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

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
  readonly totalCount: number;

  @ApiProperty()
  readonly incomesCount: number;

  @ApiProperty()
  readonly expensesCount: number;

  @ApiProperty()
  readonly transfersCount: number;

  @ApiProperty()
  readonly totalAmount: Decimal;

  @ApiProperty()
  readonly incomeAmount: Decimal;

  @ApiProperty()
  readonly expenseAmount: Decimal;

  @ApiProperty()
  readonly transferAmount: Decimal;
}
