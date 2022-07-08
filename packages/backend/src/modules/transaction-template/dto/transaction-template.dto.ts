import { TransactionTemplateDto as SharedTransactionTemplateDto } from '@local/types';
import { Transform } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionTemplateDto extends SharedTransactionTemplateDto<ObjectId> {
  @IsOptional()
  @IsInstanceOfObjectId({
    message: 'fromAccount must be formatted as objectId.',
  })
  @Transform(objectIdTransformer)
  readonly fromAccount?: ObjectId | null;

  @IsOptional()
  @IsInstanceOfObjectId({ message: 'toAccount must be formatted as objectId.' })
  @Transform(objectIdTransformer)
  readonly toAccount?: ObjectId | null;

  @IsOptional()
  @IsInstanceOfObjectId({
    message: 'categories must be formatted as array of objectIds.',
  })
  @Transform(objectIdTransformer)
  @ValidateNested({ each: true })
  categories?: ObjectId[] | null;
}
