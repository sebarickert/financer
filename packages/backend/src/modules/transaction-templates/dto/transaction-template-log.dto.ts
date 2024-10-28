import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionTemplateLog,
  TransactionTemplateType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsDate, IsUUID } from 'class-validator';

import { UserId } from '../../../types/user-id';

export class TransactionTemplateLogDto implements TransactionTemplateLog {
  constructor(partial: TransactionTemplateLog) {
    Object.assign(this, partial);
  }

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

  public static createFromPlain(
    transactionTemplateLog: TransactionTemplateLog,
  ): TransactionTemplateLogDto;
  public static createFromPlain(
    transactionTemplateLog: TransactionTemplateLog[],
  ): TransactionTemplateLogDto[];
  public static createFromPlain(
    transactionTemplateLog: TransactionTemplateLog | TransactionTemplateLog[],
  ): TransactionTemplateLogDto | TransactionTemplateLogDto[] {
    if (Array.isArray(transactionTemplateLog)) {
      return transactionTemplateLog.map((templateLog) =>
        TransactionTemplateLogDto.createFromPlain(templateLog),
      );
    }

    return new TransactionTemplateLogDto({
      ...transactionTemplateLog,
    });
  }
}
