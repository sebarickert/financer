import { Test, TestingModule } from '@nestjs/testing';

import { TransactionTemplateController } from './transaction-template.controller';
import { TransactionTemplateService } from './transaction-template.service';

describe('TransactionTemplateController', () => {
  let controller: TransactionTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionTemplateController],
      providers: [TransactionTemplateService],
    }).compile();

    controller = module.get<TransactionTemplateController>(
      TransactionTemplateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
