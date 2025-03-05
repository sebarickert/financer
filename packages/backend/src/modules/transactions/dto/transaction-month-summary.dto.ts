import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';

class TransactionMonthSummaryIdDto {
  constructor(data: TransactionMonthSummaryIdDto) {
    this.year = data.year;
    this.month = data.month;
  }

  @ApiProperty()
  year!: number;

  @ApiProperty()
  month!: number;
}

export class TransactionMonthSummaryDto {
  constructor(data?: TransactionMonthSummaryDto) {
    if (data) {
      this.id = data.id;
      this.totalCount = data.totalCount;
      this.incomesCount = data.incomesCount;
      this.expensesCount = data.expensesCount;
      this.transfersCount = data.transfersCount;
      this.totalAmount = new Decimal(data.totalAmount);
      this.incomeAmount = new Decimal(data.incomeAmount);
      this.expenseAmount = new Decimal(data.expenseAmount);
      this.transferAmount = new Decimal(data.transferAmount);
    }
  }

  @ApiProperty({ type: TransactionMonthSummaryIdDto })
  readonly id!: TransactionMonthSummaryIdDto;

  @ApiProperty()
  readonly totalCount!: number;

  @ApiProperty()
  readonly incomesCount!: number;

  @ApiProperty()
  readonly expensesCount!: number;

  @ApiProperty()
  readonly transfersCount!: number;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  readonly totalAmount!: Decimal;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  readonly incomeAmount!: Decimal;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  readonly expenseAmount!: Decimal;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  readonly transferAmount!: Decimal;

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
