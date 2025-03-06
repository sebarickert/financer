import { ApiHideProperty } from '@nestjs/swagger';
import { SystemLog, SystemLogLevel } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Allow, IsEnum, IsString, IsUUID } from 'class-validator';

export class SystemLogDto implements SystemLog {
  @IsUUID()
  readonly id!: string;

  @IsString()
  readonly module!: string;

  @IsString()
  readonly service!: string;

  @IsString()
  readonly message!: string;

  @IsEnum(SystemLogLevel)
  readonly level!: SystemLogLevel;

  @Exclude()
  @ApiHideProperty()
  @Allow()
  readonly createdAt!: Date;

  @Exclude()
  @ApiHideProperty()
  @Allow()
  readonly updatedAt!: Date;

  constructor(data?: SystemLogDto) {
    if (data) {
      this.id = data.id;
      this.module = data.module;
      this.service = data.service;
      this.message = data.message;
      this.level = data.level;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
    }
  }
}
