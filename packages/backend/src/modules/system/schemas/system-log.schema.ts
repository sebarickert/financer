import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { SystemLogLevel } from '../dto/system-log-level';

export type SystemLogDocument = SystemLog & Document<MogooseTypes.ObjectId>;

@Schema({ timestamps: true })
export class SystemLog {
  @Prop({ required: true })
  module: string;

  @Prop({ required: true })
  service: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  level: SystemLogLevel;
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);
