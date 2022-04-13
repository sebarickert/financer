import { CreateTransferDto as SharedCreateTransferDto } from '@local/types';
import { OmitType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { Allow, IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { IsNotEqual } from '../../../utils/is-not-equal.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
import { CreateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

export class CreateTransferDto extends SharedCreateTransferDto<
  ObjectId,
  CreateTransactionCategoryMappingDto
> {
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

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() =>
    OmitType(CreateTransactionCategoryMappingDto, ['transaction_id'] as const),
  )
  categories?: CreateTransactionCategoryMappingDto[];
}
