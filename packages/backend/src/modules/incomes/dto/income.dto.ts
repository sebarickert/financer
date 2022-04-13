import { IncomeDto as SharedIncomeDto } from '@local/types';
import { Transform } from 'class-transformer';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
export class IncomeDto extends SharedIncomeDto<ObjectId> {
  @IsInstanceOfObjectId({ message: 'toAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly toAccount: ObjectId;
}
