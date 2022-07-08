import { Test, TestingModule } from '@nestjs/testing';

import { TransactionTemplateService } from './transaction-template.service';

describe('TransactionTemplateService', () => {
  let service: TransactionTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTemplateService],
    }).compile();

    service = module.get<TransactionTemplateService>(
      TransactionTemplateService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
