import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { User } from 'src/users/schemas/user.schema';

export type TransactionCategoryMappingDocument = TransactionMappingCategory &
  Document;

@Schema()
export class TransactionMappingCategory {
  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ default: '' })
  description: string;

  @Prop({
    type: MogooseSchema.Types.ObjectId,
    ref: 'TransactionCategory',
    required: true,
  })
  category_id: TransactionMappingCategory;

  @Prop({
    type: MogooseSchema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  })
  transaction_id: Transaction;

  @Prop({ required: true })
  amount: number;
}

export const TransactionCategorySchema = SchemaFactory.createForClass(
  TransactionMappingCategory,
);
