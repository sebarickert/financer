import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { UserId } from '../../../types/user-id';
import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';
import { MinDecimal } from '../../../utils/min-decimal.decorator';
import { CreateTransactionCategoryMappingWithoutTransactionDto } from '../../transaction-category-mappings/dto/create-transaction-category-mapping.dto';

export class TransactionDto implements Transaction {
  constructor(values: Transaction) {
    Object.assign(this, values);
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly id: string;

  @ApiProperty()
  @MinDecimal(new Decimal(0.01), {
    message: 'Amount must be a positive number.',
  })
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount: Decimal;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly date: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId: UserId;

  @ApiProperty({ type: String })
  @IsUUID('all', { message: 'fromAccount must not be empty.' })
  readonly fromAccount: string;

  @ApiProperty({ type: String })
  @IsUUID('all', { message: 'toAccount must not be empty.' })
  readonly toAccount: string;

  @ApiProperty({
    type: CreateTransactionCategoryMappingWithoutTransactionDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionCategoryMappingWithoutTransactionDto)
  categories: CreateTransactionCategoryMappingWithoutTransactionDto[];

  public static createFromPlain(transaction: Transaction): TransactionDto;
  public static createFromPlain(transaction: Transaction[]): TransactionDto[];
  public static createFromPlain(
    transaction: Transaction | Transaction[],
  ): TransactionDto | TransactionDto[] {
    if (Array.isArray(transaction)) {
      return transaction.map((a) => TransactionDto.createFromPlain(a));
    }

    return new TransactionDto({
      ...transaction,
      amount: new Decimal(transaction.amount),
      date: new Date(transaction.date),
    });
  }
}
