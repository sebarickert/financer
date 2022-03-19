import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { Transaction } from 'src/modules/transactions/schemas/transaction.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type TransactionCategoryMappingDocument = TransactionCategoryMapping &
  Document;

@Schema()
export class TransactionCategoryMapping {
  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: '' })
  description: string;

  @Prop({
    type: MogooseSchema.Types.ObjectId,
    ref: 'TransactionCategory',
    required: true,
  })
  category_id: TransactionCategoryMapping;

  @Prop({
    type: MogooseSchema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  })
  transaction_id: Transaction;

  @Prop({ required: true })
  amount: number;
}

export const TransactionCategoryMappingSchema = SchemaFactory.createForClass(
  TransactionCategoryMapping,
);
