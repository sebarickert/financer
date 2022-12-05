import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { TransactionTemplateModule } from '../transaction-templates/transaction-templates.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        TransactionTemplateModule,
        TransactionsModule,
      ],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', async () => {
    const result = { added: 1, skipped: 0 };
    jest
      .spyOn(service, 'generateTransactions')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.generateTransactions()).toBe(result);
  });
});
