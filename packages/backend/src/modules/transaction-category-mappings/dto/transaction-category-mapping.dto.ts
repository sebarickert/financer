import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsString,
  Min,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionCategoryMappingDto {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  owner: ObjectId;

  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description: string;

  @IsNotEmpty()
  @Transform(objectIdTransformer)
  category_id: ObjectId;

  @IsNotEmpty()
  @Transform(objectIdTransformer)
  transaction_id: ObjectId;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
