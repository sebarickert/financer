import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';
import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';
import { MinDecimal } from '@/utils/min-decimal.decorator';

export class TransactionDto implements Transaction {
  constructor(data?: Transaction) {
    if (data) {
      this.id = data.id;
      this.amount = data.amount;
      this.description = data.description;
      this.date = data.date;
      this.userId = data.userId as UserId;
      this.fromAccount = data.fromAccount;
      this.toAccount = data.toAccount;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }

  @Exclude()
  @ApiHideProperty()
  createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt!: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly id!: string;

  @ApiProperty({ type: Number })
  @MinDecimal(new Decimal(0.01), {
    message: 'Amount must be a positive number.',
  })
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount!: Decimal;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description!: string;

  @ApiProperty()
  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly date!: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId!: UserId;

  @ApiProperty({ type: String, nullable: true })
  @IsUUID('all', { message: 'fromAccount must not be empty.' })
  readonly fromAccount!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @IsUUID('all', { message: 'toAccount must not be empty.' })
  readonly toAccount!: string | null;

  public static createFromPlain(transaction: Transaction): TransactionDto;
  public static createFromPlain(transaction: Transaction[]): TransactionDto[];
  public static createFromPlain(
    transaction: Transaction | Transaction[],
  ): TransactionDto | TransactionDto[] {
    if (Array.isArray(transaction)) {
      return transaction.map((item) => TransactionDto.createFromPlain(item));
    }

    return new TransactionDto({
      ...transaction,
      amount: new Decimal(transaction.amount),
      date: new Date(transaction.date),
    });
  }
}
