import mongoose, { Schema, Document } from 'mongoose';

import { USER_MODEL_NAME } from './user-model';

export const ACCOUNT_MODEL_NAME = 'account';
export interface IAccountModel extends Document, IAccount {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _id: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  owner: any;
}

export const ACCOUNT_TYPES = [
  'cash',
  'savings',
  'investment',
  'credit',
  'loan',
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

export const accountModel = mongoose.model<IAccountModel>(
  ACCOUNT_MODEL_NAME,
  accountSchema
);
