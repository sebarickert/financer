import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Account } from 'src/modules/accounts/schemas/account.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class TransactionDto {
  @IsMongoId()
  readonly _id: string;

  @IsMongoId({ message: 'fromAccount must not be empty.' })
  readonly fromAccount: Account;

  @IsMongoId({ message: 'toAccount must not be empty.' })
  readonly toAccount: Account;

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
  readonly user: User;
}
