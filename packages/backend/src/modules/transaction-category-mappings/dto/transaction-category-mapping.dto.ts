import { TransactionCategoryMappingDto as SharedTransactionCategoryMappingDto } from '@local/types';
import { Transform } from 'class-transformer';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionCategoryMappingDto extends SharedTransactionCategoryMappingDto<ObjectId> {
  @IsInstanceOfObjectId({ message: 'category_id must not be empty.' })
  @Transform(objectIdTransformer)
  category_id: ObjectId;

  @IsInstanceOfObjectId({ message: 'transaction_id must not be empty.' })
  @Transform(objectIdTransformer)
  transaction_id: ObjectId;
}
