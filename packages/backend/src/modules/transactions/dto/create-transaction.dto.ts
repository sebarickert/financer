import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { CreateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionBaseWithCategoryDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() =>
    OmitType(CreateTransactionCategoryMappingDto, ['transaction_id'] as const),
  )
  categories?: CreateTransactionCategoryMappingDto[];
}

export class CreateTransactionDto extends IntersectionType(
  OmitType(TransactionDto, [
    '_id',
    'toAccountBalance',
    'fromAccountBalance',
    'toAccount',
    'fromAccount',
  ] as const),
  CreateTransactionBaseWithCategoryDto,
) {
  @IsOptional()
  @IsMongoId({ message: 'fromAccount must not be empty.' })
  readonly fromAccount?: ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'toAccount must not be empty.' })
  readonly toAccount?: ObjectId;
}
