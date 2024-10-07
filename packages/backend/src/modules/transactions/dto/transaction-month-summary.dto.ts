import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

class TransactionMonthSummaryIdDto {
  constructor(values: TransactionMonthSummaryIdDto) {
    Object.assign(this, values);
  }

  @ApiProperty()
  year: number;

  @ApiProperty()
  month: number;
}

export class TransactionMonthSummaryDto {
  constructor(values: TransactionMonthSummaryDto) {
    Object.assign(this, values);
  }

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
  @TransformDecimal()
  @IsDecimal()
  readonly totalAmount: Decimal;

  @ApiProperty()
  @TransformDecimal()
  @IsDecimal()
  readonly incomeAmount: Decimal;

  @ApiProperty()
  @TransformDecimal()
  @IsDecimal()
  readonly expenseAmount: Decimal;

  @ApiProperty()
  @TransformDecimal()
  @IsDecimal()
  readonly transferAmount: Decimal;

  public static createFromPlain(
    data: TransactionMonthSummaryDto,
  ): TransactionMonthSummaryDto;
  public static createFromPlain(
    data: TransactionMonthSummaryDto[],
  ): TransactionMonthSummaryDto[];
  public static createFromPlain(
    data: TransactionMonthSummaryDto | TransactionMonthSummaryDto[],
  ): TransactionMonthSummaryDto | TransactionMonthSummaryDto[] {
    if (Array.isArray(data)) {
      return data.map((item) =>
        TransactionMonthSummaryDto.createFromPlain(item),
      );
    }

    return new TransactionMonthSummaryDto({
      ...data,
      id: new TransactionMonthSummaryIdDto(data.id),
      totalAmount: new Decimal(data.totalAmount),
      incomeAmount: new Decimal(data.incomeAmount),
      expenseAmount: new Decimal(data.expenseAmount),
      transferAmount: new Decimal(data.transferAmount),
    });
  }
}
