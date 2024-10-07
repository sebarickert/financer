import { ApiProperty } from '@nestjs/swagger';
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
  readonly totalAmount: number;

  @ApiProperty()
  readonly incomeAmount: number;

  @ApiProperty()
  readonly expenseAmount: number;

  @ApiProperty()
  readonly transferAmount: number;
}
