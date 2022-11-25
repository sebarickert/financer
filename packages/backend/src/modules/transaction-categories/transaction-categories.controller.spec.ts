import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';

import {
  TransactionCategory,
  TransactionCategorySchema,
} from './schemas/transaction-category.schema';
import { TransactionCategoriesController } from './transaction-categories.controller';
import { TransactionCategoriesService } from './transaction-categories.service';

describe('TransactionCategoriesController', () => {
  let controller: TransactionCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: TransactionCategory.name, schema: TransactionCategorySchema },
        ]),
        TransactionCategoryMappingsModule,
      ],
      controllers: [TransactionCategoriesController],
      providers: [TransactionCategoriesService],
    }).compile();

    controller = module.get<TransactionCategoriesController>(
      TransactionCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
