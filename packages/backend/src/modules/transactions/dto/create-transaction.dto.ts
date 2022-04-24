import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { CreateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionDto extends OmitType(TransactionDto, [
  '_id',
  'user',
  'fromAccount',
  'toAccount',
  'categories',
] as const) {
  @IsOptional()
  @IsMongoId({ message: 'fromAccount must not be empty.' })
  readonly fromAccount?: ObjectId;

  @IsOptional()
  @IsMongoId({ message: 'toAccount must not be empty.' })
  readonly toAccount?: ObjectId;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionCategoryMappingDto)
  categories?: CreateTransactionCategoryMappingDto[];
}
