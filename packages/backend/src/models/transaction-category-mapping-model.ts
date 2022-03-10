import mongoose, { Schema, Document } from 'mongoose';

import { TRANSACTION_CATEGORY_MODEL_NAME } from './transaction-category-model';
import { TRANSACTION_MODEL_NAME } from './transaction-model';
import { USER_MODEL_NAME } from './user-model';

export const TRANSACTION_CATEGORY_MAPPING_MODEL_NAME =
  'transaction-category-mapping';
export interface ITransactionCategoryMappingModel
  extends Document,
    ITransactionCategoryMapping {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
}

const transactionCategoryMappingSchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
  description: {
    type: String,
    default: '',
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSACTION_CATEGORY_MODEL_NAME,
  },
  transaction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSACTION_MODEL_NAME,
  },
  amount: Number,
});

export const transactionCategoryMappingModel =
  mongoose.model<ITransactionCategoryMappingModel>(
    TRANSACTION_CATEGORY_MAPPING_MODEL_NAME,
    transactionCategoryMappingSchema
  );
