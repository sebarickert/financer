import {
  IsMongoId,
  Min,
  IsNotEmpty,
  IsString,
  IsDateString,
} from 'class-validator';

export class TransferDto<ObjectIdType = string> {
  @IsMongoId()
  readonly _id: ObjectIdType;

  @IsMongoId()
  readonly fromAccount: ObjectIdType;

  @IsMongoId()
  readonly toAccount: ObjectIdType;

  @Min(0.01, { message: 'Amount must be a positive number.' })
  readonly amount: number;

  @IsNotEmpty({ message: 'Description must not be empty.' })
  @IsString()
  readonly description: string;

  @IsDateString({}, { message: 'Date must not be empty.' })
  readonly date: Date;

  @IsMongoId()
  readonly user: ObjectIdType;
}
