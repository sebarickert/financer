import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { accountModel } from '../models/account-model';
import { transactionCategoryMappingModel } from '../models/transaction-category-mapping-model';
import { transactionCategoryModel } from '../models/transaction-category-model';
import { transactionModel } from '../models/transaction-model';
import { userModel } from '../models/user-model';

// Extend the default timeout so MongoDB binaries can download
// jest.setTimeout(60000);

export const memoryDatabaseServer = new MongoMemoryServer({
  binary: {
    version: '4.2.16',
  },
});

export const truncate = async () => {
  if (mongoose.connection.readyState !== 0) {
    await userModel.deleteMany({});
    await accountModel.deleteMany({});
    await transactionModel.deleteMany({});
    await transactionCategoryModel.deleteMany({});
    await transactionCategoryMappingModel.deleteMany({});
  }
};

export const connect = async () => {
  await memoryDatabaseServer.ensureInstance();
  const url = memoryDatabaseServer.getUri();
  await mongoose.connect(url);
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
