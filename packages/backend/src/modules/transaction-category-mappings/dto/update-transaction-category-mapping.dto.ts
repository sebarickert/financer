import { PartialType } from '@nestjs/swagger';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class UpdateTransactionCategoryMappingDto extends PartialType(
  CreateTransactionCategoryMappingDto,
) {}
