import { TransferDto as SharedTransferDto } from '@local/types';
import { Transform } from 'class-transformer';
import { Allow } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { IsNotEqual } from '../../../utils/is-not-equal.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
export class TransferDto extends SharedTransferDto<ObjectId> {
  @Allow()
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  @IsInstanceOfObjectId({ message: 'fromAccount must not be empty.' })
  @Transform(objectIdTransformer)
  fromAccount: ObjectId;

  @IsInstanceOfObjectId({ message: 'toAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly toAccount: ObjectId;
}
