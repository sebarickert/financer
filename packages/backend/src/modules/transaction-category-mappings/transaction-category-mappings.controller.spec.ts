import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionCategoryMapping,
  TransactionCategoryMappingSchema,
} from './schemas/transaction-category-mapping.schema';
import { TransactionCategoryMappingsController } from './transaction-category-mappings.controller';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsController', () => {
  let controller: TransactionCategoryMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: TransactionCategoryMapping.name,
            schema: TransactionCategoryMappingSchema,
          },
        ]),
      ],
      controllers: [TransactionCategoryMappingsController],
      providers: [TransactionCategoryMappingsService],
    }).compile();

    controller = module.get<TransactionCategoryMappingsController>(
      TransactionCategoryMappingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
