import { OmitType } from '@nestjs/swagger';

import { TransactionDetailsDto } from '@/transactions/dto/transaction-details.dto';

export class IncomeDetailsDto extends OmitType(TransactionDetailsDto, [
  'fromAccount',
  'fromAccountName',
] as const) {
  constructor(data?: IncomeDetailsDto) {
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
      this.userId = data.userId;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.toAccountName = data.toAccountName;
      this.isRecurring = data.isRecurring;
      this.categories = data.categories;
    }
  }
}
