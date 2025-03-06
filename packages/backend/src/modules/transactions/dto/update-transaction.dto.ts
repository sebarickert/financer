import { PartialType } from '@nestjs/swagger';

import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  constructor(data?: Partial<UpdateTransactionDto>) {
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
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.categories = data.categories;
    }
  }
}
