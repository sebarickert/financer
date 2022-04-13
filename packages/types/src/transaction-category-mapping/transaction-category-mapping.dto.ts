import { IsMongoId, IsString, Min, IsOptional } from 'class-validator';

export class TransactionCategoryMappingDto<ObjectIdType = string> {
  @IsMongoId()
  _id: ObjectIdType;

  @IsMongoId()
  owner: ObjectIdType;

  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description: string;

  @IsMongoId()
  category_id: ObjectIdType;

  @IsMongoId()
  transaction_id: ObjectIdType;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
