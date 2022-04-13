import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { VisibilityType } from './category-visibility-type';

export class TransactionCategoryDto<ObjectIdType = string> {
  @IsMongoId()
  _id: ObjectIdType;

  @IsMongoId()
  owner: ObjectIdType;

  @IsNotEmpty({ message: 'Name must not be empty.' })
  name: string;

  @IsOptional()
  @IsEnum(VisibilityType, {
    each: true,
    message:
      'Visibility must be one of the following: income, expense, transfer.',
  })
  visibility: VisibilityType[];

  @IsMongoId()
  parent_category_id: ObjectIdType | null;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}
