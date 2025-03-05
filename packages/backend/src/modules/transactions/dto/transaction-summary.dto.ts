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
  constructor(transaction: TransactionSummary) {
    super();
    // @ts-expect-error - we have to manually assign these properties
    this.id = transaction.id;
    // @ts-expect-error - we have to manually assign these properties
    this.amount = new Decimal(transaction.amount);
    // @ts-expect-error - we have to manually assign these properties
    this.date = new Date(transaction.date);
    // @ts-expect-error - we have to manually assign these properties
    this.fromAccount = transaction.fromAccount;
    // @ts-expect-error - we have to manually assign these properties
    this.toAccount = transaction.toAccount;
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
