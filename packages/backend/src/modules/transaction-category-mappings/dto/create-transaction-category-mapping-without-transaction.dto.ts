import { OmitType } from '@nestjs/swagger';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingWithoutTransactionDto extends OmitType(
  CreateTransactionCategoryMappingDto,
  ['transactionId'] as const,
) {}
