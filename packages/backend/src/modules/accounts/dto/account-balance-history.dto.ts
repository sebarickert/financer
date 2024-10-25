import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDate } from 'class-validator';

import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

export class AccountBalanceHistoryDto {
  constructor(values: AccountBalanceHistoryDto) {
    Object.assign(this, values);
  }

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  amount: Decimal;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal()
  balance: Decimal;

  public static createFromPlain(
    data: AccountBalanceHistoryDto,
  ): AccountBalanceHistoryDto;
  public static createFromPlain(
    data: AccountBalanceHistoryDto[],
  ): AccountBalanceHistoryDto[];
  public static createFromPlain(
    data: AccountBalanceHistoryDto | AccountBalanceHistoryDto[],
  ): AccountBalanceHistoryDto | AccountBalanceHistoryDto[] {
    if (Array.isArray(data)) {
      return data.map((item) => AccountBalanceHistoryDto.createFromPlain(item));
    }

    return new AccountBalanceHistoryDto({
      ...data,
      date: new Date(data.date),
      amount: new Decimal(data.amount),
      balance: new Decimal(data.balance),
    });
  }
}
