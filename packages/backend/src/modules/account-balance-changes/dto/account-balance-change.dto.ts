import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { AccountBalanceChange } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';
import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';

export class AccountBalanceChangeDto implements AccountBalanceChange {
  constructor(data?: AccountBalanceChange) {
    if (data) {
      this.id = data.id;
      this.date = data.date;
      this.amount = data.amount;
      this.userId = data.userId as UserId;
      this.accountId = data.accountId;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }

  @Exclude()
  @ApiHideProperty()
  createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt!: Date;

  @ApiProperty()
  @IsUUID()
  readonly id!: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly date!: Date;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount!: Decimal;

  @ApiProperty()
  @IsUUID()
  readonly userId!: UserId;

  @ApiProperty()
  @IsUUID()
  readonly accountId!: string;

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
