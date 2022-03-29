import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { objectIdTransformer } from '../../../utils/object-id-transformer';

export class TransactionDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsNotEmpty({ message: 'fromAccount must not be empty.' })
  @Transform(objectIdTransformer)
  readonly fromAccount: ObjectId;

  @IsNotEmpty({ message: 'toAccount must not be empty.' })
  @Transform(objectIdTransformer)
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
