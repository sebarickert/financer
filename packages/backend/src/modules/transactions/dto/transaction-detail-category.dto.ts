import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, IsOptional, IsString, IsUUID } from 'class-validator';

import { TransformDecimal } from '../../../utils/is-decimal.decorator';

export class TransactionDetailCategoryDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ type: Number })
  @IsDecimal()
  @TransformDecimal()
  amount: Decimal;

  @ApiProperty()
  @IsString()
  name: string;
}
