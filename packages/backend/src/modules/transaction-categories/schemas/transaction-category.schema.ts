import { VisibilityType } from '@local/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MogooseTypes } from 'mongoose';

import { ObjectId } from '../../../types/objectId';
import { User } from '../../users/schemas/user.schema';

export type TransactionCategoryDocument = TransactionCategory &
  Document<MogooseTypes.ObjectId>;

@Schema({ collection: 'transaction-categories' })
export class TransactionCategory {
  @Prop({
    required: true,
    index: true,
    type: MogooseTypes.ObjectId,
    ref: User.name,
  })
  owner: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], index: true })
  visibility: VisibilityType[];

  @Prop({
    type: MogooseTypes.ObjectId,
    ref: TransactionCategory.name,
    default: null,
  })
  parent_category_id: ObjectId;

  @Prop({ default: false, index: true })
  deleted: boolean;
}

export const TransactionCategorySchema =
  SchemaFactory.createForClass(TransactionCategory);
