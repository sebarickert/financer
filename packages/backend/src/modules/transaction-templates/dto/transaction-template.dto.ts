import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  TransactionTemplate,
  TransactionTemplateType,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Exclude } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import { UserId } from '@/types/user-id';
import { IsDecimal, TransformDecimal } from '@/utils/is-decimal.decorator';
import { MinDecimal } from '@/utils/min-decimal.decorator';

export class TransactionTemplateDto implements TransactionTemplate {
  constructor(data?: TransactionTemplate) {
    if (data) {
      this.id = data.id;
      this.userId = data.userId as UserId;
      this.templateName = data.templateName;
      this.templateType = data.templateType;
      this.templateVisibility = data.templateVisibility;
      this.amount = data.amount;
      this.description = data.description;
      this.dayOfMonth = data.dayOfMonth;
      this.dayOfMonthToCreate = data.dayOfMonthToCreate;
      this.fromAccount = data.fromAccount;
      this.toAccount = data.toAccount;
      this.categories = data.categories;
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

  @ApiProperty()
  @IsNotEmpty({ message: 'Template name must not be empty.' })
  @IsString()
  readonly templateName!: string;

  @ApiProperty({
    enum: TransactionTemplateType,
    enumName: 'TransactionTemplateType',
    type: TransactionTemplateType,
    isArray: true,
  })
  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  @IsArray()
  readonly templateType!: TransactionTemplateType[];

  @ApiProperty({
    enum: TransactionType,
    enumName: 'TransactionType',
    type: TransactionType,
    nullable: true,
  })
  @IsEnum(TransactionType, {
    message: 'Visibility must defined.',
  })
  readonly templateVisibility!: TransactionType | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @MinDecimal(new Decimal(0.01), {
    message: 'Amount must be a positive number.',
  })
  @IsOptional()
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount: Decimal | null = null;

  @ApiProperty()
  @IsString()
  readonly description!: string;

  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsOptional()
  @Min(1, { message: 'Day of month must be a positive number.' })
  @Max(31, { message: 'Day of month must not be greater than 31.' })
  readonly dayOfMonth: number | null = null;

  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsOptional()
  @Min(1, {
    message: 'Day of month to create transaction must be a positive number.',
  })
  @Max(31, {
    message: 'Day of month to create transaction must not be greater than 31.',
  })
  readonly dayOfMonthToCreate: number | null = null;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId!: UserId;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('all', {
    message: 'fromAccount must be formatted as objectId.',
  })
  readonly fromAccount: string | null = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('all', { message: 'toAccount must be formatted as objectId.' })
  readonly toAccount: string | null = null;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsOptional()
  @IsUUID('all', {
    message: 'Categories must be formatted as objectId array.',
    each: true,
  })
  categories: string[] = [];

  public static createFromPlain(
    transactionTemplate: TransactionTemplate,
  ): TransactionTemplateDto;
  public static createFromPlain(
    transactionTemplates: TransactionTemplate[],
  ): TransactionTemplateDto[];
  public static createFromPlain(
    transactionTemplate: TransactionTemplate | TransactionTemplate[],
  ): TransactionTemplateDto | TransactionTemplateDto[] {
    if (Array.isArray(transactionTemplate)) {
      return transactionTemplate.map((template) =>
        TransactionTemplateDto.createFromPlain(template),
      );
    }

    return new TransactionTemplateDto({
      ...transactionTemplate,
      amount:
        transactionTemplate.amount instanceof Decimal
          ? new Decimal(transactionTemplate.amount)
          : null,
    });
  }
}
