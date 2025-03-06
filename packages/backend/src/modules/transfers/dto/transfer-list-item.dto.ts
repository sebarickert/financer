import { OmitType } from '@nestjs/swagger';

import { TransactionListItemDto } from '@/transactions/dto/transaction-list-item.dto';

export class TransferListItemDto extends OmitType(
  TransactionListItemDto,
  [] as const,
) {
  constructor(data?: Partial<TransferListItemDto>) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.id = data.id;
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.fromAccount = data.fromAccount;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;
    }
  }
}
