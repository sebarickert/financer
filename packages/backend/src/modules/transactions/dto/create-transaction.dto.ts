import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { CreateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionBaseWithCategoryDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() =>
    OmitType(CreateTransactionCategoryMappingDto, ['transaction_id'] as const),
  )
  categories: CreateTransactionCategoryMappingDto[];
}

export class CreateTransactionDto extends IntersectionType(
  OmitType(TransactionDto, [
    '_id',
    'toAccountBalance',
    'fromAccountBalance',
  ] as const),
  CreateTransactionBaseWithCategoryDto,
) {}
