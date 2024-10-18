import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionTemplateLog,
  TransactionTemplateType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsDate, IsUUID } from 'class-validator';

import { UserId } from '../../../types/user-id';

export class TransactionTemplateLogDto implements TransactionTemplateLog {
  @IsUUID()
  readonly id: string;

  @IsUUID()
  readonly userId: UserId;

  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  readonly eventType: TransactionTemplateType;

  @IsUUID()
  readonly transactionId: string = null;

  @IsUUID()
  readonly templateId: string = null;

  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly executed: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
