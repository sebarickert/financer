import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, ValidateNested } from 'class-validator';

import { TransactionDetailCategoryDto } from './transaction-detail-category.dto';
import { TransactionDto } from './transaction.dto';

export type TransactionDetails = Transaction & {
  fromAccountName: string | null;
  toAccountName: string | null;
  isRecurring: boolean;
  categories: TransactionDetailCategoryDto[];
};

export class TransactionDetailsDto
  extends TransactionDto
  implements TransactionDetails
{
  constructor(values: TransactionDetails) {
    super(values);
    Object.assign(this, values);
  }

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  fromAccountName!: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @IsString()
  toAccountName!: string | null;

  @ApiProperty()
  @IsBoolean()
  isRecurring!: boolean;

  @ApiProperty({
    enum: TransactionType,
    enumName: 'TransactionType',
    description: 'Type of the transaction',
  })
  @IsEnum(TransactionType)
  @Transform(({ obj }: Record<'obj', TransactionDetailsDto>) => {
    if (obj.fromAccount !== null && obj.toAccount !== null) {
      return TransactionType.TRANSFER;
    } else if (obj.fromAccount !== null) {
      return TransactionType.EXPENSE;
    }
    return TransactionType.INCOME;
  })
  type!: TransactionType;

  @ApiProperty({
    type: TransactionDetailCategoryDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => TransactionDetailCategoryDto)
  categories!: TransactionDetailCategoryDto[];

  public static createFromPlain(
    transaction: TransactionDetails,
  ): TransactionDetailsDto;
  public static createFromPlain(
    transaction: TransactionDetails[],
  ): TransactionDetailsDto[];
  public static createFromPlain(
    transaction: TransactionDetails | TransactionDetails[],
  ): TransactionDetailsDto | TransactionDetailsDto[] {
    if (Array.isArray(transaction)) {
      return transaction.map((item) =>
        TransactionDetailsDto.createFromPlain(item),
      );
    }

    return new TransactionDetailsDto({
      ...transaction,
    });
  }
}
