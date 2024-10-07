import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionTemplateLog,
  TransactionTemplateType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsMongoId, IsEnum, IsDate } from 'class-validator';

import { UserId } from '../../../types/user-id';

export class TransactionTemplateLogDto implements TransactionTemplateLog {
  @IsMongoId()
  readonly id: string;

  @IsMongoId()
  readonly userId: UserId;

  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  readonly eventType: TransactionTemplateType;

  @IsMongoId()
  readonly transactionId: string = null;

  @IsMongoId()
  readonly templateId: string = null;

  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly executed: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
