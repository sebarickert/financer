import { CreateTransactionCategoryDto as SharedCreateTransactionCategoryDto } from '@local/types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class CreateTransactionCategoryDto extends SharedCreateTransactionCategoryDto<ObjectId> {
  @IsOptional()
  @IsInstanceOfObjectId({ message: 'parent_category_id must not be empty.' })
  @Transform(objectIdTransformer)
  parent_category_id: ObjectId | null;
}
