import { ApiProperty } from '@silte/nestjs-swagger';
import { IsDate, IsNumber } from 'class-validator';

export class AccountBalanceHistoryDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  balance: number;
}
