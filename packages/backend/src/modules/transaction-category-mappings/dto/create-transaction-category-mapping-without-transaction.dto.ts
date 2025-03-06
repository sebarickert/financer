import { OmitType } from '@nestjs/swagger';

import { CreateTransactionCategoryMappingDto } from './create-transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingWithoutTransactionDto extends OmitType(
  CreateTransactionCategoryMappingDto,
  ['transactionId'] as const,
) {
  constructor(data?: CreateTransactionCategoryMappingWithoutTransactionDto) {
    super(data);
    if (data) {
      this.amount = data.amount;
      this.categoryId = data.categoryId;
      this.description = data.description;
    }
  }
}
