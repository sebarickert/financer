import mongoose, { Schema, Document } from "mongoose";
import { ACCOUNT_MODEL_NAME } from "./account-model";
import { USER_MODEL_NAME } from "./user-model";

export const TRANSACTION_MODEL_NAME = "transaction";
export interface ITransactionModel extends Document, ITransaction {
  _id: any;
}

const transactionSchema = new Schema({
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ACCOUNT_MODEL_NAME,
    default: null,
  },
  toAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ACCOUNT_MODEL_NAME,
    default: null,
  },
  fromAccountBalance: {
    type: Number,
    default: null,
  },
  toAccountBalance: {
    type: Number,
    default: null,
  },
  amount: Number,
  description: {
    type: String,
    default: "",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
  date: Date,
});

transactionSchema
  .path("fromAccountBalance")
  .get((num: number) => parseFloat((num / 100).toFixed(2)));
transactionSchema.path("fromAccountBalance").set((num: number) => num * 100);

transactionSchema
  .path("toAccountBalance")
  .get((num: number) => parseFloat((num / 100).toFixed(2)));
transactionSchema.path("toAccountBalance").set((num: number) => num * 100);

export default mongoose.model<ITransactionModel>(
  TRANSACTION_MODEL_NAME,
  transactionSchema
);
