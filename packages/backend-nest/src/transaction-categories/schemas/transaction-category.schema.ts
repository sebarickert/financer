import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MogooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TransactionCategoryDocument = TransactionCategory & Document;

enum VisibilityType {
  income = 'income',
  expense = 'expense',
  transfer = 'transfer',
}

@Schema()
export class TransactionCategory {
  @Prop({ required: true, type: MogooseSchema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ required: true })
  name: string;

  @Prop([VisibilityType])
  visibility: VisibilityType[];

  @Prop({
    type: MogooseSchema.Types.ObjectId,
    ref: 'TransactionCategory',
    default: null,
  })
  parent_category_id: TransactionCategory;

  @Prop({ default: false })
  deleted: boolean;
}

export const TransactionCategorySchema =
  SchemaFactory.createForClass(TransactionCategory);
