import { Test, TestingModule } from '@nestjs/testing';

import { TransactionCategoryMappingsController } from './transaction-category-mappings.controller';
import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsController', () => {
  let controller: TransactionCategoryMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
