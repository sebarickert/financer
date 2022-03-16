import { PartialType } from '@nestjs/mapped-types';

import { CreateTransactionCategoryDto } from './create-transaction-category.dto';

export class UpdateTransactionCategoryDto extends PartialType(
  CreateTransactionCategoryDto,
) {}
