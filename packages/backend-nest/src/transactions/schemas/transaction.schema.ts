import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { User } from 'src/users/schemas/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ type: MogooseSchema.Types.ObjectId, ref: 'Account', default: null })
  fromAccount: Account;

  @Prop({ type: MogooseSchema.Types.ObjectId, ref: 'Account', default: null })
  toAccount: Account;

  @Prop({ default: null })
  fromAccountBalance: number;

  @Prop({ default: null })
  toAccountBalance: number;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  date: Date;

  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
