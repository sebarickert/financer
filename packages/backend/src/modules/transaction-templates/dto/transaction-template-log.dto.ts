import { ApiHideProperty } from '@nestjs/swagger';
import {
  TransactionTemplateLog,
  TransactionTemplateType,
} from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsEnum, IsUUID } from 'class-validator';

import { UserId } from '@/types/user-id';

export class TransactionTemplateLogDto implements TransactionTemplateLog {
  constructor(data?: TransactionTemplateLog) {
    if (data) {
      this.id = data.id;
      this.userId = data.userId as UserId;
      this.eventType = data.eventType;
      this.transactionId = data.transactionId;
      this.templateId = data.templateId;
      this.executed = data.executed;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }

  @IsUUID()
  readonly id!: string;

  @IsUUID()
  readonly userId!: UserId;

  @IsEnum(TransactionTemplateType, {
    each: true,
    message: 'Type must defined.',
  })
  readonly eventType!: TransactionTemplateType;

  @IsUUID()
  readonly transactionId!: string;

  @IsUUID()
  readonly templateId!: string;

  @IsDate({ message: 'Date must not be empty.' })
  @Type(() => Date)
  readonly executed!: Date;

  @Exclude()
  @ApiHideProperty()
  createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt!: Date;

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
