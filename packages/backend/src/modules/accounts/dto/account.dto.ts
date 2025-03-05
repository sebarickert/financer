import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UserId } from '@/types/user-id';
import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';

type IAccount = Account & {
  currentDateBalance: Decimal | null;
};

type CreateFromPlainAccount = Account & {
  currentDateBalance?: Decimal | null;
};

export class AccountDto implements IAccount {
  constructor(data?: IAccount) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.balance = data.balance;
      this.currentDateBalance = data.currentDateBalance;
      this.userId = data.userId as UserId;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.isDeleted = data.isDeleted;
    }
  }

  @Exclude()
  @ApiHideProperty()
  createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt!: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly id!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name!: string;

  @ApiProperty({
    enum: AccountType,
    enumName: 'AccountType',
    type: AccountType,
  })
  @IsEnum(AccountType, {
    message: `Type must be one of the following: ${Object.values(AccountType).join(', ')}.`,
  })
  readonly type!: AccountType;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal({ message: 'Balance must be a decimal number, with 2 decimals.' })
  readonly balance!: Decimal;

  @ApiProperty({ type: Number, nullable: true })
  @TransformDecimal()
  @IsDecimal({
    message: 'Current Date Balance must be a decimal number, with 2 decimals.',
  })
  @IsOptional()
  readonly currentDateBalance!: Decimal | null;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId!: UserId;

  @ApiProperty()
  @IsBoolean()
  isDeleted!: boolean;

  public static createFromPlain(account: CreateFromPlainAccount): AccountDto;
  public static createFromPlain(
    account: CreateFromPlainAccount[],
  ): AccountDto[];
  public static createFromPlain(
    account: CreateFromPlainAccount | CreateFromPlainAccount[],
  ): AccountDto | AccountDto[] {
    if (Array.isArray(account)) {
      return account.map((item) => AccountDto.createFromPlain(item));
    }

    return new AccountDto({
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
      balance: new Decimal(account.balance),
      currentDateBalance: account.currentDateBalance
        ? new Decimal(account.currentDateBalance)
        : null,
    });
  }
}
