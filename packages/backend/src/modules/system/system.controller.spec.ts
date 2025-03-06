import { Test, TestingModule } from '@nestjs/testing';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';

import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('SystemController', () => {
  let controller: SystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemController],
      providers: [createMockServiceProvider(SystemService)],
    }).compile();

    controller = module.get<SystemController>(SystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
