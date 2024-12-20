import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UserId } from '../../../types/user-id';
import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

export class AccountDto implements Account {
  constructor(values: Account) {
    Object.assign(this, values);
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    enum: AccountType,
    enumName: 'AccountType',
    type: AccountType,
  })
  @IsEnum(AccountType, {
    message: `Type must be one of the following: ${Object.values(AccountType).join(', ')}.`,
  })
  readonly type: AccountType;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal({ message: 'Balance must be a decimal number, with 2 decimals.' })
  readonly balance: Decimal;

  @ApiProperty({ type: Number })
  @TransformDecimal()
  @IsDecimal({
    message: 'Current Date Balance must be a decimal number, with 2 decimals.',
  })
  @IsOptional()
  readonly currentDateBalance?: Decimal;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId: UserId;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;

  public static createFromPlain(account: Account): AccountDto;
  public static createFromPlain(account: Account[]): AccountDto[];
  public static createFromPlain(
    account: Account | Account[],
  ): AccountDto | AccountDto[] {
    if (Array.isArray(account)) {
      return account.map((a) => AccountDto.createFromPlain(a));
    }

    const accountDto = {
      ...account,
      createdAt: new Date(account.createdAt),
      updatedAt: new Date(account.updatedAt),
      balance: new Decimal(account.balance),
    };

    // TODO: Add to Prisma model
    // Conditionally add currentDateBalance if it exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((account as any)?.currentDateBalance !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accountDto as any).currentDateBalance = new Decimal(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (account as any).currentDateBalance,
      );
    }

    return new AccountDto(accountDto);
  }
}
