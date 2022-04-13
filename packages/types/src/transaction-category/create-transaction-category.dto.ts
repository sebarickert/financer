import { IsNotEmpty, IsOptional, IsEnum, IsMongoId } from 'class-validator';

import { VisibilityType } from './category-visibility-type';

export class CreateTransactionCategoryDto<ObjectIdType = string> {
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
}
