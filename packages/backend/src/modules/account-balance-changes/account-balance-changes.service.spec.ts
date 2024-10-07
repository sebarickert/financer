import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { AccountBalanceChangeRepo } from '../../database/repos/account-balance-change.repo';

import { AccountBalanceChangesService } from './account-balance-changes.service';

describe('AccountBalanceChangesService', () => {
  let service: AccountBalanceChangesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountBalanceChangesService,
        createMockServiceProvider(AccountBalanceChangeRepo),
      ],
    }).compile();

    service = module.get<AccountBalanceChangesService>(
      AccountBalanceChangesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
