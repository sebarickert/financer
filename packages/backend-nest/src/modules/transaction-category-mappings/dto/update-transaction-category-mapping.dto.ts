import { PartialType } from '@nestjs/mapped-types';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class UpdateTransactionCategoryMappingDto extends PartialType(
  CreateTransactionCategoryMappingDto,
) {}
