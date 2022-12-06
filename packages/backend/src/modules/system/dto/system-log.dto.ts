import { Allow, IsEnum, IsMongoId, IsString } from 'class-validator';

import { ObjectId } from '../../../types/objectId';

import { SystemLogLevel } from './system-log-level';

export class SystemLogDto {
  @IsMongoId()
  readonly _id: ObjectId;

  @IsString()
  readonly module: string;

  @IsString()
  readonly service: string;

  @IsString()
  readonly message: string;

  @IsEnum(SystemLogLevel)
  readonly level: SystemLogLevel;

  @Allow()
  readonly createdAt: Date;

  @Allow()
  readonly updatedAt: Date;
}
