import { OmitType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';

export class CreateExpenseDto extends OmitType(CreateTransactionDto, [
  'toAccount',
] as const) {
  constructor(data?: CreateExpenseDto) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.fromAccount = data.fromAccount;

      this.categories = data.categories;
    }
  }
}
