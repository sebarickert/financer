import { ApiProperty } from '@nestjs/swagger';
import { AccountBalanceChange } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId } from 'class-validator';

import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';

export class AccountBalanceChangeDto implements AccountBalanceChange {
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
  readonly userId: string;

  @ApiProperty()
  @IsMongoId()
  readonly accountId: string;
}
