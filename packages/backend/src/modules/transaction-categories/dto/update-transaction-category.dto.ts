import { UpdateTransactionCategoryDto as SharedUpdateTransactionCategoryDto } from '@local/types';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

class TmpClass extends SharedUpdateTransactionCategoryDto<ObjectId> {}

export class UpdateTransactionCategoryDto extends PartialType(TmpClass) {
  @IsOptional()
  @IsInstanceOfObjectId({ message: 'parent_category_id must not be empty.' })
  @Transform(objectIdTransformer)
  parent_category_id?: ObjectId | null;
}
