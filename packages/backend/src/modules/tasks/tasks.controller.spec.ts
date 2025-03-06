import { Test, TestingModule } from '@nestjs/testing';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [createMockServiceProvider(TasksService)],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', async () => {
    const result = { added: 1, skipped: 0, missingData: 0 };
    jest
      .spyOn(service, 'generateTransactions')
      .mockImplementation(() => Promise.resolve(result));

    expect(await controller.generateTransactions()).toBe(result);
  });
});
