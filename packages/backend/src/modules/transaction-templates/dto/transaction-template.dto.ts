import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TransactionTemplate,
  TransactionTemplateType,
  TransactionType,
} from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
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

import { UserId } from '../../../types/user-id';
import {
  IsDecimal,
  TransformDecimal,
} from '../../../utils/is-decimal.decorator';
import { MinDecimal } from '../../../utils/min-decimal.decorator';

export class TransactionTemplateDto implements TransactionTemplate {
  constructor(partial: TransactionTemplate) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Template name must not be empty.' })
  @IsString()
  readonly templateName: string;

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
  readonly templateType: TransactionTemplateType[];

  @ApiProperty({
    enum: TransactionType,
    enumName: 'TransactionType',
    type: TransactionType,
  })
  @IsEnum(TransactionType, {
    message: 'Visibility must defined.',
  })
  readonly templateVisibility: TransactionType;

  @ApiPropertyOptional()
  @MinDecimal(new Decimal(0.01), {
    message: 'Amount must be a positive number.',
  })
  @IsOptional()
  @TransformDecimal()
  @IsDecimal({ message: 'Amount must be a decimal number.' })
  readonly amount: Decimal = null;

  @ApiPropertyOptional()
  @IsString()
  readonly description: string = null;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(1, { message: 'Day of month must be a positive number.' })
  @Max(31, { message: 'Day of month must not be greater than 31.' })
  readonly dayOfMonth: number = null;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(1, {
    message: 'Day of month to create transaction must be a positive number.',
  })
  @Max(31, {
    message: 'Day of month to create transaction must not be greater than 31.',
  })
  readonly dayOfMonthToCreate: number = null;

  @ApiProperty({ type: String })
  @IsUUID()
  readonly userId: UserId;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('all', {
    message: 'fromAccount must be formatted as objectId.',
  })
  readonly fromAccount: string = null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @IsOptional()
  @IsUUID('all', { message: 'toAccount must be formatted as objectId.' })
  readonly toAccount: string = null;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsOptional()
  @IsUUID('all', {
    message: 'Categories must be formatted as objectId array.',
    each: true,
  })
  categories: string[] = null;

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
      amount: new Decimal(transactionTemplate.amount),
    });
  }
}
