import { OmitType } from '@nestjs/mapped-types';

import { TransactionTemplateLogDto } from './transaction-template-log.dto';

export class CreateTransactionTemplateLogDto extends OmitType(
  TransactionTemplateLogDto,
  ['id', 'createdAt', 'updatedAt'] as const,
) {
  constructor(data?: CreateTransactionTemplateLogDto) {
    super(data);
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.userId = data.userId;
      // @ts-expect-error - we have to manually assign these properties
      this.eventType = data.eventType;
      // @ts-expect-error - we have to manually assign these properties
      this.transactionId = data.transactionId;
      // @ts-expect-error - we have to manually assign these properties
      this.templateId = data.templateId;
      // @ts-expect-error - we have to manually assign these properties
      this.executed = data.executed;
    }
  }
}
