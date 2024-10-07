import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { SystemLogRepo } from '../../database/repos/system-log.repo';

import { SystemService } from './system.service';

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
