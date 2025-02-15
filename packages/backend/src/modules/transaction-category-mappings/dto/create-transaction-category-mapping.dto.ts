import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryMappingDto } from '@/transaction-category-mappings/dto/transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingDto extends OmitType(
  TransactionCategoryMappingDto,
  ['id', 'userId', 'createdAt', 'updatedAt'] as const,
) {}
