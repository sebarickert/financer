import { PartialType } from '@silte/nestjs-swagger';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class UpdateTransactionCategoryMappingDto extends PartialType(
  CreateTransactionCategoryMappingDto,
) {}
