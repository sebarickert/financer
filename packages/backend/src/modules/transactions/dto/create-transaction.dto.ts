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
  constructor(data?: CreateTransactionDto) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.fromAccount = data.fromAccount;
      // @ts-expect-error - we have to manually assign these properties
      this.toAccount = data.toAccount;

      this.categories = data.categories;
    }
  }

  @ApiPropertyOptional({
    type: [CreateTransactionCategoryMappingWithoutTransactionDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionCategoryMappingWithoutTransactionDto)
  categories?: CreateTransactionCategoryMappingWithoutTransactionDto[];
}
