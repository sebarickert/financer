import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';

import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
      ],
      providers: [UserPreferencesService],
    }).compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
