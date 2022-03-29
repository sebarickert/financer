import { Transform } from 'class-transformer';
import { IsMongoId, IsString, Min, IsOptional } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionCategoryMappingDto {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  owner: ObjectId;

  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description: string;

  @IsInstanceOfObjectId({ message: 'category_id must not be empty.' })
  @Transform(objectIdTransformer)
  category_id: ObjectId;

  @IsInstanceOfObjectId({ message: 'transaction_id must not be empty.' })
  @Transform(objectIdTransformer)
  transaction_id: ObjectId;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
