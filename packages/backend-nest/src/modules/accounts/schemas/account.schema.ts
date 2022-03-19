import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export type AccountDocument = Account & Document;

export enum AccounTypes {
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
  type: AccounTypes;

  @Prop({ required: true })
  balance: string;

  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
