import { OmitType } from '@silte/nestjs-swagger';

import { TransactionCategoryDto } from './transaction-category.dto';

export class CreateTransactionCategoryDto extends OmitType(
  TransactionCategoryDto,
  ['_id', 'owner', 'deleted'] as const,
) {}
