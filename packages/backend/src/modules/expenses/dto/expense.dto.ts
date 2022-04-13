import { ExpenseDto as SharedExpenseDto } from '@local/types';
import { Transform } from 'class-transformer';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
export class ExpenseDto extends SharedExpenseDto<ObjectId> {
  @IsInstanceOfObjectId({ message: 'fromAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly fromAccount: ObjectId;
}
