import { CreateTransactionCategoryMappingDto as SharedCreateTransactionCategoryMappingDto } from '@local/types';
import { Transform } from 'class-transformer';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class CreateTransactionCategoryMappingDto extends SharedCreateTransactionCategoryMappingDto<ObjectId> {
  @IsInstanceOfObjectId({ message: 'category_id must not be empty.' })
  @Transform(objectIdTransformer)
  category_id: ObjectId;
}
