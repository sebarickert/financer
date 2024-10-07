import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

export class AccountDto implements Account {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsMongoId()
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

  @ApiProperty()
  @TransformDecimal()
  @IsDecimal({ message: 'Balance must be a decimal number, with 2 decimals.' })
  readonly balance: Decimal;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly userId: string;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;
}
