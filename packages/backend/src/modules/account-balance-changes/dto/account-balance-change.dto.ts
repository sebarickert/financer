import { ApiProperty } from '@nestjs/swagger';
import { AccountBalanceChange } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId } from 'class-validator';

import { UserId } from '../../../types/user-id';
import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

export class AccountBalanceChangeDto implements AccountBalanceChange {
  constructor(partial: AccountBalanceChange) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  @IsMongoId()
  readonly id: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly date: Date;

  @ApiProperty()
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount: Decimal;

  @ApiProperty()
  @IsMongoId()
  readonly userId: UserId;

  @ApiProperty()
  @IsMongoId()
  readonly accountId: string;

  public static createFromPlain(
    accountBalanceChange: AccountBalanceChange,
  ): AccountBalanceChangeDto;
  public static createFromPlain(
    accountBalanceChanges: AccountBalanceChange[],
  ): AccountBalanceChangeDto[];
  public static createFromPlain(
    accountBalanceChange: AccountBalanceChange | AccountBalanceChange[],
  ): AccountBalanceChangeDto | AccountBalanceChangeDto[] {
    if (Array.isArray(accountBalanceChange)) {
      return accountBalanceChange.map((change) =>
        AccountBalanceChangeDto.createFromPlain(change),
      );
    }

    return new AccountBalanceChangeDto(accountBalanceChange);
  }
}
