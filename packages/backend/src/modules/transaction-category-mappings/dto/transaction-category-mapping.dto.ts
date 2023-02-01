import { ApiProperty, ApiPropertyOptional } from '@silte/nestjs-swagger';
import { Transform } from 'class-transformer';
import { IsMongoId, IsOptional, IsString, Min } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionCategoryMappingDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: ObjectId;

  @ApiProperty({ type: String })
  @IsMongoId()
  owner: ObjectId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Description must not be empty.' })
  description?: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  @IsInstanceOfObjectId({ message: 'category_id must not be empty.' })
  @Transform(objectIdTransformer)
  category_id: ObjectId;

  @ApiProperty({ type: String })
  @IsMongoId()
  @IsInstanceOfObjectId({ message: 'transaction_id must not be empty.' })
  @Transform(objectIdTransformer)
  transaction_id: ObjectId;

  @ApiProperty()
  @Min(0.01, { message: 'Amount must be a positive number.' })
  amount: number;
}
