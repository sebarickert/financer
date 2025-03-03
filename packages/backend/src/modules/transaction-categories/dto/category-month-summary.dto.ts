/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { Allow } from 'class-validator';

import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';

class CategoryMonthlySummaryDtoId {
  constructor(data: CategoryMonthlySummaryDtoId) {
    Object.assign(this, data);
  }

  @ApiProperty()
  readonly year!: number;

  @ApiProperty()
  readonly month!: number;
}

export class CategoryMonthlySummaryDto {
  constructor(data: CategoryMonthlySummaryDto) {
    Object.assign(this, data);
  }

  @ApiProperty()
  @Allow()
  readonly id!: CategoryMonthlySummaryDtoId;

  @ApiProperty()
  readonly totalCount!: number;

  @ApiProperty()
  readonly incomesCount!: number;

  @ApiProperty()
  readonly expensesCount!: number;

  @ApiProperty()
  readonly transfersCount!: number;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @TransformDecimal()
  readonly totalAmount!: Decimal;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @TransformDecimal()
  readonly incomeAmount!: Decimal;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @TransformDecimal()
  readonly expenseAmount!: Decimal;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @TransformDecimal()
  readonly transferAmount!: Decimal;

  public static createFromPlain(
    summaries: CategoryMonthlySummaryDto,
  ): CategoryMonthlySummaryDto;
  public static createFromPlain(
    summaries: CategoryMonthlySummaryDto[],
  ): CategoryMonthlySummaryDto[];
  public static createFromPlain(
    summaries: CategoryMonthlySummaryDto | CategoryMonthlySummaryDto[],
  ): CategoryMonthlySummaryDto | CategoryMonthlySummaryDto[] {
    if (Array.isArray(summaries)) {
      return summaries.map((summary) => new CategoryMonthlySummaryDto(summary));
    }

    return new CategoryMonthlySummaryDto(summaries);
  }
}
