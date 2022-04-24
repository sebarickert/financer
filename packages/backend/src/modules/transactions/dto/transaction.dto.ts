import { TransactionDto as SharedTransactionDto } from '@local/types';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
import { TransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/transaction-category-mapping.dto';

export class TransactionDto extends SharedTransactionDto<
  ObjectId,
  TransactionCategoryMappingDto
> {
  @IsInstanceOfObjectId({ message: 'fromAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly fromAccount: ObjectId;

  @IsInstanceOfObjectId({ message: 'toAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly toAccount: ObjectId;

  @ValidateNested({ each: true })
  @Type(() => TransactionCategoryMappingDto)
  categories: TransactionCategoryMappingDto[];
}
