import { Allow } from 'class-validator';

export class TransactionMonthSummaryDto {
  @Allow()
  readonly _id: {
    year: number;
    month: number;
  };

  @Allow()
  readonly count: number;

  @Allow()
  readonly totalAmount: number;
}
