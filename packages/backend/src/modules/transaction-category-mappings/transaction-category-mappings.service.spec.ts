import { Test, TestingModule } from '@nestjs/testing';

import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsService', () => {
  let service: TransactionCategoryMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
