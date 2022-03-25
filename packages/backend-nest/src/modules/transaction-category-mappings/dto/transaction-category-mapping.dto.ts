import { IsMongoId, IsString, Min, IsOptional } from 'class-validator';

import { Transaction } from '../../transactions/schemas/transaction.schema';
import { User } from '../../users/schemas/user.schema';
import { TransactionCategoryMapping } from '../schemas/transaction-category-mapping.schema';
export class TransactionCategoryMappingDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  owner: User;

  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description: string;

  @IsMongoId()
  category_id: TransactionCategoryMapping;

  @IsMongoId()
  transaction_id: Transaction;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
