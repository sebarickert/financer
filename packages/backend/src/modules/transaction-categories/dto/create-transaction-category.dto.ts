import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryDto } from './transaction-category.dto';

export class CreateTransactionCategoryDto extends OmitType(
  TransactionCategoryDto,
  ['_id', 'owner'] as const,
) {}
