import mongoose, { Schema, Document } from "mongoose";
import { USER_MODEL_NAME } from "./user-model";

export const TRANSACTION_CATEGORY_MODEL_NAME = "transaction-category";
export interface ITransactionCategoryModel
  extends Document,
    ITransactionCategory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  deleted: boolean;
}

const transactionCategorySchema = new Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
  name: String,
  visibility: [
    {
      type: String,
    },
  ],
  parent_category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: TRANSACTION_CATEGORY_MODEL_NAME,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ITransactionCategoryModel>(
  TRANSACTION_CATEGORY_MODEL_NAME,
  transactionCategorySchema
);
