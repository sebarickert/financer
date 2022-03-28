import { IsMongoId, IsString, Min, IsOptional } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
export class TransactionCategoryMappingDto {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  owner: ObjectId;

  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description: string;

  @IsMongoId()
  category_id: ObjectId;

  @IsMongoId()
  transaction_id: ObjectId;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
