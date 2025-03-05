import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { Transaction, TransactionType } from '@prisma/client';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, ValidateNested } from 'class-validator';

import { TransactionListItemCategoryDto } from './transaction-list-item-category.dto';
import { TransactionDto } from './transaction.dto';

export type TransactionListItem = Pick<
  Transaction,
  'description' | 'amount' | 'id' | 'date' | 'fromAccount' | 'toAccount'
> & {
  isRecurring: boolean;
  categories: TransactionListItemCategoryDto[];
};

export class TransactionListItemDto
  extends PickType(TransactionDto, [
    'description',
    'amount',
    'id',
    'date',
    'fromAccount',
    'toAccount',
  ] as const)
  implements TransactionListItem
{
  constructor(data: TransactionListItem) {
    super(data);

    // @ts-expect-error - we have to manually assign these properties
    this.description = data.description;
    // @ts-expect-error - we have to manually assign these properties
    this.amount = data.amount;
    // @ts-expect-error - we have to manually assign these properties
    this.id = data.id;
    // @ts-expect-error - we have to manually assign these properties
    this.date = data.date;

    this.isRecurring = data.isRecurring;
    this.fromAccount = data.fromAccount;
    this.toAccount = data.toAccount;
    this.categories = data.categories;
  }

  @ApiProperty()
  @IsBoolean()
  isRecurring!: boolean;

  @ApiProperty({
    enum: TransactionType,
    enumName: 'TransactionType',
    description: 'Type of the transaction',
  })
  @IsEnum(TransactionType)
  @Transform(({ obj }: Record<'obj', TransactionListItem>) => {
    if (obj.fromAccount !== null && obj.toAccount !== null) {
      return TransactionType.TRANSFER;
    } else if (obj.fromAccount !== null) {
      return TransactionType.EXPENSE;
    }
    return TransactionType.INCOME;
  })
  type!: TransactionType;

  @ApiHideProperty()
  @Exclude()
  readonly fromAccount!: string | null;

  @ApiHideProperty()
  @Exclude()
  readonly toAccount!: string | null;

  @ApiProperty({
    type: TransactionListItemCategoryDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  @Type(() => TransactionListItemCategoryDto)
  categories!: TransactionListItemCategoryDto[];

  public static createFromPlain(
    transaction: TransactionListItem,
  ): TransactionListItemDto;
  public static createFromPlain(
    transaction: TransactionListItem[],
  ): TransactionListItemDto[];
  public static createFromPlain(
    transaction: TransactionListItem | TransactionListItem[],
  ): TransactionListItemDto | TransactionListItemDto[] {
    if (Array.isArray(transaction)) {
      return transaction.map((item) =>
        TransactionListItemDto.createFromPlain(item),
      );
    }

    return new TransactionListItemDto({
      ...transaction,
    });
  }
}
