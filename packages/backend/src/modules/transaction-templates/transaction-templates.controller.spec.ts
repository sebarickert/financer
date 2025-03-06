import { Test, TestingModule } from '@nestjs/testing';

import { TransactionTemplatesController } from './transaction-templates.controller';
import { TransactionTemplatesService } from './transaction-templates.service';

import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('TransactionTemplateController', () => {
  let controller: TransactionTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionTemplatesController],
      providers: [createMockServiceProvider(TransactionTemplatesService)],
    }).compile();

    controller = module.get<TransactionTemplatesController>(
      TransactionTemplatesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
