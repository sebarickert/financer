import { IsDateString, IsMongoId, IsNumber } from 'class-validator';

import { ObjectId } from '../../../types/objectId';

export class AccountBalanceChangeDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsDateString()
  readonly date: Date;

  @IsNumber()
  readonly amount: number;

  @IsMongoId()
  readonly userId: ObjectId;

  @IsMongoId()
  readonly accountId: ObjectId;
}
