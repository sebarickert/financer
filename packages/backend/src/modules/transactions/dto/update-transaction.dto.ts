import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { UpdateTransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/update-transaction-category-mapping.dto';

import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class UpdateTransactionBaseWithCategoryDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateTransactionCategoryMappingDto)
  categories: UpdateTransactionCategoryMappingDto[];
}
