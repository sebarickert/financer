import { OmitType } from '@nestjs/swagger';

import { TransactionListItemDto } from '@/transactions/dto/transaction-list-item.dto';

export class ExpenseListItemDto extends OmitType(TransactionListItemDto, [
  'toAccount',
] as const) {
  constructor(data?: ExpenseListItemDto) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.fromAccount = data.fromAccount;
      // @ts-expect-error - we have to manually assign these properties
      this.id = data.id;

      this.categories = data.categories;
      this.isRecurring = data.isRecurring;
    }
  }
}
