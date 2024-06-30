import { ApiProperty } from '@nestjs/swagger';
import { AccountBalanceChange } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsMongoId, IsNumber } from 'class-validator';

export class AccountBalanceChangeDto implements AccountBalanceChange {
  v: number;

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
  @IsNumber()
  readonly amount: number;

  @ApiProperty()
  @IsMongoId()
  readonly userId: string;

  @ApiProperty()
  @IsMongoId()
  readonly accountId: string;
}
