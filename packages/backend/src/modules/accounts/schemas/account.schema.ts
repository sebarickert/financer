import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { User } from '../../users/schemas/user.schema';

export type AccountDocument = Account & Document<MogooseTypes.ObjectId>;

export enum AccounType {
  cash = 'cash',
  savings = 'savings',
  investment = 'investment',
  credit = 'credit',
  loan = 'loan',
}

@Schema()
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: AccounType;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true, type: MogooseTypes.ObjectId, ref: User.name })
  owner: ObjectId;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
