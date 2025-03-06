import { OmitType } from '@nestjs/swagger';

import { TransactionCategoryMappingDto } from './transaction-category-mapping.dto';

export class CreateTransactionCategoryMappingDto extends OmitType(
  TransactionCategoryMappingDto,
  ['id', 'userId', 'createdAt', 'updatedAt'] as const,
) {
  constructor(data?: CreateTransactionCategoryMappingDto) {
    super(data);
    if (data) {
      this.amount = data.amount;
      this.categoryId = data.categoryId;
      this.description = data.description;
      this.transactionId = data.transactionId;
    }
  }
}
