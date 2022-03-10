import { ITransaction } from '@local/types';
import mongoose, { Schema, Document } from 'mongoose';

import { ACCOUNT_MODEL_NAME } from './account-model';
import { USER_MODEL_NAME } from './user-model';

export const TRANSACTION_MODEL_NAME = 'transaction';
export interface ITransactionModel extends Document, ITransaction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: USER_MODEL_NAME,
  },
  date: Date,
});

export const transactionModel = mongoose.model<ITransactionModel>(
  TRANSACTION_MODEL_NAME,
  transactionSchema
);
