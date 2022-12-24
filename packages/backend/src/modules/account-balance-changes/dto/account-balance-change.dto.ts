import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNumber } from 'class-validator';

import { ObjectId } from '../../../types/objectId';

export class AccountBalanceChangeDto {
  @ApiProperty()
  @IsMongoId()
  readonly _id: ObjectId;

  @ApiProperty()
  @IsDateString()
  readonly date: Date;

  @ApiProperty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty()
  @IsMongoId()
  readonly userId: ObjectId;

  @ApiProperty()
  @IsMongoId()
  readonly accountId: ObjectId;
}
