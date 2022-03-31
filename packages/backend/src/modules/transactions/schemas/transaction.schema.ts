import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { Account } from '../../accounts/schemas/account.schema';
import { User } from '../../users/schemas/user.schema';

export type TransactionDocument = Transaction & Document<MogooseTypes.ObjectId>;

@Schema()
export class Transaction {
  @Prop({ type: MogooseTypes.ObjectId, ref: Account.name, default: null })
  fromAccount: ObjectId;

  @Prop({ type: MogooseTypes.ObjectId, ref: Account.name, default: null })
  toAccount: ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  date: Date;

  @Prop({ required: true, type: MogooseTypes.ObjectId, ref: User.name })
  user: ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
