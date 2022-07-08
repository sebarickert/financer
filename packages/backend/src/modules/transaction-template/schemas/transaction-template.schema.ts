import { TransactionTemplateType, TransactionType } from '@local/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { Transaction } from '../../transactions/schemas/transaction.schema';
import { User } from '../../users/schemas/user.schema';

export type TransactionTemplateDocument = TransactionTemplate &
  Document<MogooseTypes.ObjectId>;

@Schema({ collection: 'transaction-templates' })
export class TransactionTemplate {
  @Prop({
    required: true,
    index: true,
    type: MogooseTypes.ObjectId,
    ref: User.name,
  })
  userId: ObjectId;

  @Prop({ required: true })
  templateName: string;

  @Prop({ required: true, type: [String], index: true })
  templateType: TransactionTemplateType[];

  @Prop({ required: true, index: true })
  templateVisibility: TransactionType;

  @Prop({
    type: MogooseTypes.ObjectId,
    ref: Transaction.name,
  })
  fromAccount: ObjectId;

  @Prop({
    type: MogooseTypes.ObjectId,
    ref: Transaction.name,
  })
  toAccount: ObjectId;

  @Prop(Number)
  amount: number;

  @Prop({})
  description: string;

  @Prop({ index: true, type: Number })
  dayOfMonth: number;

  @Prop({ type: [String] })
  categories: ObjectId[];
}

export const TransactionTemplateSchema =
  SchemaFactory.createForClass(TransactionTemplate);
