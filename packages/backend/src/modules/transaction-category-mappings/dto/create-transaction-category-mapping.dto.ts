import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryMappingDto } from './transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingDto extends OmitType(
  TransactionCategoryMappingDto,
  ['id', 'userId', 'createdAt', 'updatedAt'] as const,
) {}

export class CreateTransactionCategoryMappingWithoutTransactionDto extends OmitType(
  CreateTransactionCategoryMappingDto,
  ['transactionId'] as const,
) {}
