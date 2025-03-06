import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { TransactionCategory, TransactionType } from '@prisma/client';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { UserId } from '@/types/user-id';

export class TransactionCategoryDto implements TransactionCategory {
  constructor(data?: TransactionCategory) {
    if (data) {
      this.id = data.id;
      this.userId = data.userId as UserId;
      this.name = data.name;
      this.visibility = data.visibility;
      this.deleted = data.deleted;
      this.parentCategoryId = data.parentCategoryId;
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
  id!: string;

  @ApiProperty({ type: String })
  @IsUUID()
  userId!: UserId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  name!: string;

  @ApiProperty({
    enum: TransactionType,
    enumName: 'TransactionType',
    type: TransactionType,
    isArray: true,
  })
  @IsOptional()
  @IsEnum(TransactionType, {
    each: true,
    message: `Visibility must be one of the following: ${Object.values(TransactionType).join(', ')}.`,
  })
  visibility!: TransactionType[];

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  deleted!: boolean;

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('all', { message: 'parentCategoryId must not be empty.' })
  parentCategoryId!: string | null;

  public static createFromPlain(
    category: TransactionCategory,
  ): TransactionCategoryDto;
  public static createFromPlain(
    categories: TransactionCategory[],
  ): TransactionCategoryDto[];
  public static createFromPlain(
    categoryOrCategories: TransactionCategory | TransactionCategory[],
  ): TransactionCategoryDto | TransactionCategoryDto[] {
    if (Array.isArray(categoryOrCategories)) {
      return categoryOrCategories.map((category) =>
        TransactionCategoryDto.createFromPlain(category),
      );
    }
    return new TransactionCategoryDto(categoryOrCategories);
  }
}
