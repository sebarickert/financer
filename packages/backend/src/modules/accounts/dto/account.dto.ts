import { AccountType } from '@local/types';
import { ApiProperty } from '@silte/nestjs-swagger';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AccountDto<ObjectId = string> {
  @ApiProperty({ type: String })
  @IsMongoId()
  readonly _id: ObjectId;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    enum: AccountType,
    enumName: 'AccountType',
    type: AccountType,
  })
  @IsEnum(AccountType, {
    message:
      'Type must be one of the following: cash, savings, investment, credit, loan.',
  })
  readonly type: AccountType;

  @ApiProperty()
  @IsNumber({}, { message: 'Balance must be a number.' })
  readonly balance: number;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly owner: ObjectId;

  @ApiProperty()
  @IsBoolean()
  isDeleted?: boolean;
}
