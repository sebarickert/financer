import { TransactionTemplateType, TransactionType } from '@local/types';
import { ApiProperty, ApiPropertyOptional } from '@silte/nestjs-swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionTemplateDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  readonly _id: ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Template name must not be empty.' })
  @IsString()
  readonly templateName: string;

  @ApiProperty({
    enum: TransactionTemplateType,
    enumName: 'TransactionTemplateType',
    type: TransactionTemplateType,
  })
  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
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
  @Min(0.01, { message: 'Amount must be a positive number.' })
  readonly amount?: number;

  @ApiPropertyOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(1, { message: 'Day of month must be a positive number.' })
  @Max(31, { message: 'Day of month must not be greater than 31.' })
  readonly dayOfMonth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Min(1, {
    message: 'Day of month to create transaction must be a positive number.',
  })
  @Max(31, {
    message: 'Day of month to create transaction must not be greater than 31.',
  })
  readonly dayOfMonthToCreate?: number;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly userId: ObjectId;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsInstanceOfObjectId({
    message: 'fromAccount must be formatted as objectId.',
  })
  @Transform(objectIdTransformer)
  readonly fromAccount?: ObjectId | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsInstanceOfObjectId({ message: 'toAccount must be formatted as objectId.' })
  @Transform(objectIdTransformer)
  readonly toAccount?: ObjectId | null;

  @ApiPropertyOptional({ type: String, isArray: true })
  @IsOptional()
  @IsInstanceOfObjectId({
    message: 'categories must be formatted as array of objectIds.',
  })
  @Transform(objectIdTransformer)
  @ValidateNested({ each: true })
  categories?: ObjectId[] | null;
}
