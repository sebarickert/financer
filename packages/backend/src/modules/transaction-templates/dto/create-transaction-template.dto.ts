import { OmitType } from '@nestjs/swagger';

import { TransactionTemplateDto } from './transaction-template.dto';

export class CreateTransactionTemplateDto extends OmitType(
  TransactionTemplateDto,
  ['id', 'userId', 'createdAt', 'updatedAt'] as const,
) {}
