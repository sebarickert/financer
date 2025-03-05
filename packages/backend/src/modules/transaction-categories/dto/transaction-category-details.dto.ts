import { ApiProperty } from '@nestjs/swagger';
import { TransactionCategory } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransactionCategoryDto } from './transaction-category.dto';

type TransactionCategoryDetails = TransactionCategory & {
  path: string;
};

export class TransactionCategoryDetailsDto
  extends TransactionCategoryDto
  implements TransactionCategoryDetails
{
  constructor(data?: TransactionCategoryDetails) {
    super(data);

    if (data) {
      this.path = data.path;
    }
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  path!: string;

  public static createFromPlain(
    category: TransactionCategoryDetails,
  ): TransactionCategoryDetailsDto;
  public static createFromPlain(
    categories: TransactionCategoryDetails[],
  ): TransactionCategoryDetailsDto[];
  public static createFromPlain(
    categoryOrCategories:
      | TransactionCategoryDetails
      | TransactionCategoryDetails[],
  ): TransactionCategoryDetailsDto | TransactionCategoryDetailsDto[] {
    if (Array.isArray(categoryOrCategories)) {
      return categoryOrCategories.map((category) =>
        TransactionCategoryDetailsDto.createFromPlain(category),
      );
    }
    return new TransactionCategoryDetailsDto(categoryOrCategories);
  }
}
