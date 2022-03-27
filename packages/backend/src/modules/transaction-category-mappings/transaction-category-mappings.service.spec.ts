import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';

import {
  TransactionCategoryMapping,
  TransactionCategoryMappingSchema,
} from './schemas/transaction-category-mapping.schema';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsService', () => {
  let service: TransactionCategoryMappingsService;

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
      providers: [TransactionCategoryMappingsService],
    }).compile();

    service = module.get<TransactionCategoryMappingsService>(
      TransactionCategoryMappingsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
