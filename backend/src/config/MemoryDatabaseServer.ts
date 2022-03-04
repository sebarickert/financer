import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { accountModel } from '../models/account-model';
import { transactionCategoryMappingModel } from '../models/transaction-category-mapping-model';
import { transactionCategoryModel } from '../models/transaction-category-model';
import { transactionModel } from '../models/transaction-model';
import { userModel } from '../models/user-model';

// Extend the default timeout so MongoDB binaries can download
// jest.setTimeout(60000);

class MemoryDatabaseServer {
  server: MongoMemoryServer;

  constructor() {
    this.server = new MongoMemoryServer({
      binary: {
        version: '4.2.16',
      },
      // autoStart: false,
    });
  }

  async start() {
    await this.server.start();
  }

  async stop() {
    await this.server?.stop();
  }
}

export const memoryDatabaseServer = new MemoryDatabaseServer();

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
  const url = await memoryDatabaseServer.server?.getUri();
  await mongoose.connect(url);
};

export const disconnect = async () => {
  await mongoose.disconnect();
};
