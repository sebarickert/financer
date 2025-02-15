import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionCategoryMapping } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';
import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';
import { MinDecimal, ONE_CENT } from '@/utils/min-decimal.decorator';

export class TransactionCategoryMappingDto
  implements TransactionCategoryMapping
{
  constructor(mapping: TransactionCategoryMapping) {
    Object.assign(this, mapping);
  }

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  id!: string;

  @ApiProperty({ type: String })
  @IsUUID()
  userId!: UserId;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string | null = null;

  @ApiProperty({ type: String })
  @IsUUID('all', { message: 'categoryId must not be empty.' })
  categoryId!: string;

  @ApiProperty({ type: String })
  @IsUUID('all', { message: 'transactionId must not be empty.' })
  transactionId!: string;

  @ApiProperty({ type: Number })
  @MinDecimal(ONE_CENT, {
    message: 'Amount must be a positive number.',
  })
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  amount!: Decimal;

  public static createFromPlain(
    mappings: TransactionCategoryMapping,
  ): TransactionCategoryMappingDto;
  public static createFromPlain(
    mappings: TransactionCategoryMapping[],
  ): TransactionCategoryMappingDto[];
  public static createFromPlain(
    mappings: TransactionCategoryMapping | TransactionCategoryMapping[],
  ): TransactionCategoryMappingDto | TransactionCategoryMappingDto[] {
    if (Array.isArray(mappings)) {
      return mappings.map(
        (mapping) => new TransactionCategoryMappingDto(mapping),
      );
    }

    return new TransactionCategoryMappingDto(mappings);
  }
}
