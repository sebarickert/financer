import { Test, TestingModule } from '@nestjs/testing';

import { TransactionTemplatesService } from './transaction-templates.service';

import { TransactionTemplateLogRepo } from '@/modules/transaction-templates/transaction-template-log.repo';
import { TransactionTemplateRepo } from '@/modules/transaction-templates/transaction-template.repo';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('TransactionTemplatesService', () => {
  let service: TransactionTemplatesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionTemplatesService,
        createMockServiceProvider(TransactionTemplateRepo),
        createMockServiceProvider(TransactionTemplateLogRepo),
      ],
    }).compile();

    service = module.get<TransactionTemplatesService>(
      TransactionTemplatesService,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
