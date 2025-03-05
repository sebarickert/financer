import { OmitType } from '@nestjs/swagger';

import { TransactionTemplateDto } from './transaction-template.dto';

export class CreateTransactionTemplateDto extends OmitType(
  TransactionTemplateDto,
  ['id', 'userId', 'createdAt', 'updatedAt'] as const,
) {
  constructor(data?: CreateTransactionTemplateDto) {
    super(data);
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.templateName = data.templateName;
      // @ts-expect-error - we have to manually assign these properties
      this.templateType = data.templateType;
      // @ts-expect-error - we have to manually assign these properties
      this.templateVisibility = data.templateVisibility;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.dayOfMonth = data.dayOfMonth;
      // @ts-expect-error - we have to manually assign these properties
      this.dayOfMonthToCreate = data.dayOfMonthToCreate;
      // @ts-expect-error - we have to manually assign these properties
      this.fromAccount = data.fromAccount;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.categories = [...data.categories];
    }
  }
}
