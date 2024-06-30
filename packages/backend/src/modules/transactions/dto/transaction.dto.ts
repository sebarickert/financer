import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateTransactionCategoryMappingWithoutTransactionDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

export class TransactionDto implements Transaction {
  v: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly id: string;

  @ApiProperty()
  @Min(0.01, { message: 'Amount must be a positive number.' })
  readonly amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly date: Date;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly userId: string;

  @ApiProperty({ type: String })
  @IsMongoId({ message: 'fromAccount must not be empty.' })
  readonly fromAccount: string;

  @ApiProperty({ type: String })
  @IsMongoId({ message: 'toAccount must not be empty.' })
  readonly toAccount: string;

  @ApiProperty({
    type: CreateTransactionCategoryMappingWithoutTransactionDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionCategoryMappingWithoutTransactionDto)
  categories: CreateTransactionCategoryMappingWithoutTransactionDto[];
}
