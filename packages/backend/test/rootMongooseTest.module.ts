import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { getMemoryDbUri } from '../src/config/memoryDatabaseServer';

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      return {
        uri: await getMemoryDbUri(),
        ...options,
      };
    },
  });
