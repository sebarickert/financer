import { OmitType } from '@nestjs/mapped-types';

import { TransactionCategoryDto } from './transaction-category.dto';
export class CreateTransactionCategoryDto extends OmitType(
  TransactionCategoryDto,
  ['_id', 'deleted', 'owner'] as const,
) {}
