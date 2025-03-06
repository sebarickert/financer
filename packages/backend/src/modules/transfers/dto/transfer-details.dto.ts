import { OmitType } from '@nestjs/swagger';

import { TransactionDetailsDto } from '@/transactions/dto/transaction-details.dto';

export class TransferDetailsDto extends OmitType(
  TransactionDetailsDto,
  [] as const,
) {
  constructor(data?: TransferDetailsDto) {
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
      this.fromAccount = data.fromAccount;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.fromAccountName = data.fromAccountName;
      this.toAccountName = data.toAccountName;
      this.isRecurring = data.isRecurring;
      this.categories = data.categories;
    }
  }
}
