import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';

import { AccountBalanceChangesService } from './account-balance-changes.service';

describe('AccountBalanceChangesService', () => {
  let service: AccountBalanceChangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
      ],

      providers: [AccountBalanceChangesService],
    }).compile();

    service = module.get<AccountBalanceChangesService>(
      AccountBalanceChangesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
