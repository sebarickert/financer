import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { TransactionTemplateLogRepo } from '../../database/repos/transaction-template-log.repo';
import { TransactionTemplateRepo } from '../../database/repos/transaction-template.repo';

import { TransactionTemplatesService } from './transaction-templates.service';

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
