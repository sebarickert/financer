import { OmitType } from '@nestjs/mapped-types';

import { TransactionTemplateLogDto } from './transaction-template-log.dto';

export class CreateTransactionTemplateLogDto extends OmitType(
  TransactionTemplateLogDto,
  ['_id'] as const,
) {}
