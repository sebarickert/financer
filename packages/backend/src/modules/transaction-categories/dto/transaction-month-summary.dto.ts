import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Allow } from 'class-validator';

export class CategoryMonthlySummaryDto {
  @ApiProperty()
  @Allow()
  readonly id: {
    year: number;
    month: number;
  };

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
