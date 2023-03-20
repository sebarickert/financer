import { VisibilityType } from '@local/types';
import { ApiProperty } from '@silte/nestjs-swagger';
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
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: ObjectId;

  @ApiProperty({ type: String })
  @IsMongoId()
  owner: ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  name: string;

  @ApiProperty({
    enum: VisibilityType,
    enumName: 'VisibilityType',
    type: VisibilityType,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(VisibilityType, {
    each: true,
    message:
      'Visibility must be one of the following: income, expense, transfer.',
  })
  visibility: VisibilityType[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deleted: boolean;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsInstanceOfObjectId({ message: 'parent_category_id must not be empty.' })
  @Transform(objectIdTransformer)
  parent_category_id: ObjectId | null;
}
