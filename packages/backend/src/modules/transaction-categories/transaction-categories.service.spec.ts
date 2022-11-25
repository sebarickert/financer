import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';

import {
  TransactionCategory,
  TransactionCategorySchema,
} from './schemas/transaction-category.schema';
import { TransactionCategoriesService } from './transaction-categories.service';

describe('TransactionCategoriesService', () => {
  let service: TransactionCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          {
            name: TransactionCategory.name,
            schema: TransactionCategorySchema,
          },
        ]),
        TransactionCategoryMappingsModule,
      ],
      providers: [TransactionCategoriesService],
    }).compile();

    service = module.get<TransactionCategoriesService>(
      TransactionCategoriesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
