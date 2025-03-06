import { Test, TestingModule } from '@nestjs/testing';

import { UserPreferencesService } from './user-preferences.service';

import { UserPreferencesRepo } from '@/database/repos/user-preferences.repo';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        createMockServiceProvider(UserPreferencesRepo),
      ],
    }).compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
