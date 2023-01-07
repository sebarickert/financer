import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryMappingDto } from './transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingDto extends OmitType(
  TransactionCategoryMappingDto,
  ['_id', 'owner'] as const,
) {}

export class CreateTransactionCategoryMappingWithoutTransactionDto extends OmitType(
  CreateTransactionCategoryMappingDto,
  ['transaction_id'] as const,
) {}
