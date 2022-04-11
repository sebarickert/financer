import { VisibilityType } from '@local/types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionCategoryDto {
  @IsMongoId()
  _id: ObjectId;

  @IsMongoId()
  owner: ObjectId;

  @IsNotEmpty({ message: 'Name must not be empty.' })
  name: string;

  @IsOptional()
  @IsEnum(VisibilityType, {
    each: true,
    message:
      'Visibility must be one of the following: income, expense, transfer.',
  })
  visibility: VisibilityType[];

  @IsOptional()
  @IsInstanceOfObjectId({ message: 'parent_category_id must not be empty.' })
  @Transform(objectIdTransformer)
  parent_category_id: ObjectId | null;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}
