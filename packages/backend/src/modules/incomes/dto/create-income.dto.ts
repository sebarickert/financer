import { OmitType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';

export class CreateIncomeDto extends OmitType(CreateTransactionDto, [
  'fromAccount',
] as const) {
  constructor(data?: Partial<CreateIncomeDto>) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.categories = data.categories;
    }
  }
}
