import { IsDate, IsNumber } from 'class-validator';

export class AccountBalanceHistoryDto {
  @IsDate()
  date: Date;

  @IsNumber()
  amount: number;

  @IsNumber()
  balance: number;
}
