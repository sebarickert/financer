import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import {
  TransactionCategory,
  VisibilityType,
} from '../schemas/transaction-category.schema';

export class TransactionCategoryDto {
  @IsMongoId()
  _id: string;

  @IsMongoId()
  owner: User;

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
  @IsMongoId()
  parent_category_id: TransactionCategory;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}
