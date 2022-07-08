import {
  IsMongoId,
  Min,
  IsNotEmpty,
  IsString,
  IsDateString,
  ValidateNested,
  IsEnum,
} from 'class-validator';

import { TransactionType } from '../transaction/transaction-type';

import { TransactionTemplateType } from './transaction-template-type';

export class CreateTransactionTemplateDto<ObjectIdType = string> {
  @IsNotEmpty({ message: 'Template name must not be empty.' })
  @IsString()
  readonly templateName: string;

  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  readonly templateType: TransactionTemplateType[];

  @IsEnum(TransactionType, {
    message: 'Type must defined.',
  })
  readonly templateVisibility: TransactionType;

  @IsMongoId()
  readonly fromAccount?: ObjectIdType;

  @IsMongoId()
  readonly toAccount?: ObjectIdType;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  readonly amount?: number;

  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description?: string;

  @IsDateString({}, { message: 'Date must not be empty.' })
  readonly dayOfMonth?: Date;

  @ValidateNested({ each: true })
  readonly categories?: ObjectIdType[];
}
