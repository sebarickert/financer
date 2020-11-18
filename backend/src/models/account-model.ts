import mongoose, { Schema, Document } from "mongoose";
import { USER_MODEL_NAME } from "./user-model";

export const ACCOUNT_MODEL_NAME = "account";
export interface IAccountModel extends Document, IAccount {
  _id: any;
  owner: any;
}

export const ACCOUNT_TYPES = [
  "cash",
  "savings",
  "investment",
  "credit",
  "loan",
];

const accountSchema = new Schema({
  name: String,
  type: String,
  balance: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
});

export default mongoose.model<IAccountModel>(ACCOUNT_MODEL_NAME, accountSchema);
