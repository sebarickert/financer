import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { AccounType } from '../schemas/account.schema';

export class AccountDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name: string;

  @IsEnum(AccounType, {
    message:
      'Type must be one of the following: cash, savings, investment, credit, loan.',
  })
  readonly type: AccounType;

  @IsNumber({}, { message: 'Balance must be a number.' })
  readonly balance: number;

  @IsMongoId()
  readonly owner: ObjectId;
}
