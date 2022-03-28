import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { User } from '../../users/schemas/user.schema';

export type TransactionCategoryDocument = TransactionCategory &
  Document<MogooseTypes.ObjectId>;

export enum VisibilityType {
  income = 'income',
  expense = 'expense',
  transfer = 'transfer',
}

@Schema({ collection: 'transaction-categories' })
export class TransactionCategory {
  @Prop({ required: true, type: MogooseTypes.ObjectId, ref: User.name })
  owner: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop([String])
  visibility: VisibilityType[];

  @Prop({
    type: MogooseTypes.ObjectId,
    ref: TransactionCategory.name,
    default: null,
  })
  parent_category_id: ObjectId;

  @Prop({ default: false })
  deleted: boolean;
}

export const TransactionCategorySchema =
  SchemaFactory.createForClass(TransactionCategory);
