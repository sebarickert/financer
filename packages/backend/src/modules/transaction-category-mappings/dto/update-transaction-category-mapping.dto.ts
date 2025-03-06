import { PartialType } from '@nestjs/swagger';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class UpdateTransactionCategoryMappingDto extends PartialType(
  CreateTransactionCategoryMappingDto,
) {
  constructor(data?: UpdateTransactionCategoryMappingDto) {
    super(data);
    if (data) {
      this.amount = data.amount;
      this.categoryId = data.categoryId;
      this.description = data.description;
      this.transactionId = data.transactionId;
    }
  }
}
