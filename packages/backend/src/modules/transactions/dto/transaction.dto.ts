import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { TransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/transaction-category-mapping.dto';

export class TransactionDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsMongoId({ message: 'fromAccount must not be empty.' })
  readonly fromAccount: ObjectId;

  @IsMongoId({ message: 'toAccount must not be empty.' })
  readonly toAccount: ObjectId;

  @IsNumber()
  readonly fromAccountBalance: number;

  @IsNumber()
  readonly toAccountBalance: number;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  readonly amount: number;

  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description: string;

  @IsDateString({}, { message: 'Date must not be empty.' })
  readonly date: Date;

  @IsMongoId()
  readonly user: ObjectId;
}
