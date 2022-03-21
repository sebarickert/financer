import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type AccountDocument = Account & Document;

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

  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
