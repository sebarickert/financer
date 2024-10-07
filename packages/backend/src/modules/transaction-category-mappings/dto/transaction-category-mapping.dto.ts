import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionCategoryMapping } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsMongoId, IsOptional, IsString } from 'class-validator';

import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';
import { MinDecimal } from '../../../utils/min-decimal.decorator';

export class TransactionCategoryMappingDto
  implements TransactionCategoryMapping
{
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsMongoId()
  id: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string = null;

  @ApiProperty({ type: String })
  @IsMongoId({ message: 'categoryId must not be empty.' })
  categoryId: string;

  @ApiProperty({ type: String })
  @IsMongoId({ message: 'transactionId must not be empty.' })
  transactionId: string;

  @ApiProperty()
  @MinDecimal(new Decimal(0.01), {
    message: 'Amount must be a positive number.',
  })
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  amount: Decimal;
}
