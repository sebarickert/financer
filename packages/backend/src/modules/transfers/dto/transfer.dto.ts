import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsNotEqual } from '../../../utils/is-not-equal.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class TransferDto extends TransactionDto {
  @IsNotEmpty({ message: 'fromAccount must not be empty.' })
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  @Transform(objectIdTransformer)
  fromAccount: ObjectId;
}
