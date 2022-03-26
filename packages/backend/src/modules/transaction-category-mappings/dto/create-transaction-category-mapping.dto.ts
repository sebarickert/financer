import { OmitType } from '@nestjs/mapped-types';

import { TransactionCategoryMappingDto } from './transaction-category-mapping.dto';
export class CreateTransactionCategoryMappingDto extends OmitType(
  TransactionCategoryMappingDto,
  ['_id', 'owner'],
) {
  _id: any;
}
