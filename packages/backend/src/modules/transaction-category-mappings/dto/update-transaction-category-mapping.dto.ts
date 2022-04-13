import { UpdateTransactionCategoryMappingDto as SharedUpdateTransactionCategoryMappingDto } from '@local/types';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

class TmpClass extends SharedUpdateTransactionCategoryMappingDto<ObjectId> {}

export class UpdateTransactionCategoryMappingDto extends PartialType(TmpClass) {
  @IsInstanceOfObjectId({ message: 'category_id must not be empty.' })
  @Transform(objectIdTransformer)
  category_id: ObjectId;
}
