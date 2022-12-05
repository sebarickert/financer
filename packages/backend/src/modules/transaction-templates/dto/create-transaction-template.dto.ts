import { OmitType } from '@nestjs/swagger';

import { TransactionTemplateDto } from './transaction-template.dto';

export class CreateTransactionTemplateDto extends OmitType(
  TransactionTemplateDto,
  ['_id', 'userId'] as const,
) {}
