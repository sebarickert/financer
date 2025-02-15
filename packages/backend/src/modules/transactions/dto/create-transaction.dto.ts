import {
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { CreateTransactionCategoryMappingWithoutTransactionDto } from '@/transaction-category-mappings/dto/create-transaction-category-mapping-without-transaction.dto';
import { TransactionDto } from '@/transactions/dto/transaction.dto';

export class CreateTransactionDto extends IntersectionType(
  OmitType(TransactionDto, [
    'id',
    'userId',
    'fromAccount',
    'toAccount',
    'updatedAt',
    'createdAt',
  ] as const),
  PartialType(PickType(TransactionDto, ['fromAccount', 'toAccount'] as const)),
) {
  @ApiPropertyOptional({
    type: [CreateTransactionCategoryMappingWithoutTransactionDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionCategoryMappingWithoutTransactionDto)
  categories?: CreateTransactionCategoryMappingWithoutTransactionDto[];
}
