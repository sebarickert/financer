import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryDto } from './transaction-category.dto';

export class CreateTransactionCategoryDto extends OmitType(
  TransactionCategoryDto,
  ['id', 'userId', 'deleted', 'createdAt', 'updatedAt'] as const,
) {
  constructor(data?: CreateTransactionCategoryDto) {
    super();
    if (data) {
      this.name = data.name;
      this.visibility = data.visibility;
      this.parentCategoryId = data.parentCategoryId;
    }
  }
}
