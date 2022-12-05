import { TransactionTemplateType } from '@local/types';
import { IsMongoId, IsEnum, IsDateString } from 'class-validator';

import { ObjectId } from '../../../types/objectId';

export class TransactionTemplateLogDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsMongoId()
  readonly userId: ObjectId;

  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  readonly eventType: TransactionTemplateType;

  @IsMongoId()
  readonly transactionId?: ObjectId;

  @IsMongoId()
  readonly templateId?: ObjectId;

  @IsDateString({}, { message: 'Date must not be empty.' })
  readonly executed: Date;
}
