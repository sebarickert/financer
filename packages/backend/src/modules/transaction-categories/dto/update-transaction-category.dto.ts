import { PartialType } from '@silte/nestjs-swagger';

import { CreateTransactionCategoryDto } from './create-transaction-category.dto';

export class UpdateTransactionCategoryDto extends PartialType(
  CreateTransactionCategoryDto,
) {}
