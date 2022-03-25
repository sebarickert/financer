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

import { Account } from '../../accounts/schemas/account.schema';
import { TransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/transaction-category-mapping.dto';
import { User } from '../../users/schemas/user.schema';

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

export class TransactionBaseWithCategoryDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TransactionCategoryMappingDto)
  categories: TransactionCategoryMappingDto[];
}
