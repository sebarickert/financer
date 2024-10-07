import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDate, IsNumber } from 'class-validator';

export class AccountBalanceHistoryDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNumber()
  amount: Decimal;

  @ApiProperty()
  @IsNumber()
  balance: Decimal;
}
