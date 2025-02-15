import { Test, TestingModule } from '@nestjs/testing';

import { SystemService } from './system.service';

import { SystemLogRepo } from '@/database/repos/system-log.repo';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('SystemService', () => {
  let service: SystemService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemService, createMockServiceProvider(SystemLogRepo)],
    }).compile();

    service = module.get<SystemService>(SystemService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
