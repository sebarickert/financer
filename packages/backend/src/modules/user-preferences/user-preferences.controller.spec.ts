import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';

import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesController', () => {
  let controller: UserPreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesController],
      providers: [createMockServiceProvider(UserPreferencesService)],
    }).compile();

    controller = module.get<UserPreferencesController>(
      UserPreferencesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
