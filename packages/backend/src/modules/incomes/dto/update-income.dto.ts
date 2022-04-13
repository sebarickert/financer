import { UpdateIncomeDto as SharedUpdateIncomeDto } from '@local/types';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';
import { CreateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

class TmpClass extends SharedUpdateIncomeDto<
  ObjectId,
  CreateTransactionCategoryMappingDto
> {}

export class UpdateIncomeDto extends PartialType(TmpClass) {
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
