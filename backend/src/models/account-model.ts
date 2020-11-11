import mongoose, { Schema, Document } from "mongoose";
import { USER_MODEL_NAME } from "./user-model";

export const ACCOUNT_MODEL_NAME = "account";
export interface IAccountModel extends Document, IAccount {}

const accountSchema = new Schema({
  name: String,
  type: String,
  saldo: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
});

accountSchema
  .path("saldo")
  .get((num: number) => parseFloat((num / 100).toFixed(2)));
accountSchema.path("saldo").set((num: number) => num * 100);

export default mongoose.model<IAccountModel>(ACCOUNT_MODEL_NAME, accountSchema);
