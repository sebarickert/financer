import { PickType } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { TransactionDto } from './transaction.dto';

type TransactionSummary = Pick<
  Transaction,
  'id' | 'amount' | 'date' | 'fromAccount' | 'toAccount'
>;

export class TransactionSummaryDto
  extends PickType(TransactionDto, [
    'id',
    'fromAccount',
    'toAccount',
    'amount',
    'date',
  ] as const)
  implements TransactionSummary
{
  constructor(values: TransactionSummary) {
    super(values);
    Object.assign(this, values);
  }

  public static createFromPlain(
    transaction: TransactionSummary,
  ): TransactionSummaryDto;
  public static createFromPlain(
    transaction: TransactionSummary[],
  ): TransactionSummaryDto[];
  public static createFromPlain(
    transaction: TransactionSummary | TransactionSummary[],
  ): TransactionSummaryDto | TransactionSummaryDto[] {
    if (Array.isArray(transaction)) {
      return transaction.map((item) =>
        TransactionSummaryDto.createFromPlain(item),
      );
    }

    return new TransactionSummaryDto({
      ...transaction,
      amount: new Decimal(transaction.amount),
      date: new Date(transaction.date),
    });
  }
}
