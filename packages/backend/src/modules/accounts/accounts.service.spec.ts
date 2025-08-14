import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';

import { AccountsService } from './accounts.service';

import { AccountBalanceChangesService } from '@/account-balance-changes/account-balance-changes.service';
import { DUMMY_TEST_USER } from '@/config/mockAuthenticationMiddleware';
import { AccountBalanceChangeRepo } from '@/modules/account-balance-changes/account-balance-change.repo';
import { AccountRepo } from '@/modules/accounts/account.repo';
import {
  accountsRepoFindAllMockData,
  accountsRepoFindById,
} from '@/database/repos/mocks/account-repo-mock';
import { transactionsRepoFindAllByAccountIdMockData } from '@/database/repos/mocks/transactions-repo-mock';
import { TransactionRepo } from '@/modules/transactions/transaction.repo';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';
import { TransactionCategoriesService } from '@/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '@/transaction-category-mappings/transaction-category-mappings.service';
import { TransactionsService } from '@/transactions/transactions.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountRepo: jest.Mocked<AccountRepo>;
  let accountBalanceChangeRepo: jest.Mocked<AccountBalanceChangeRepo>;
  let transactionRepo: jest.Mocked<TransactionRepo>;
  let accountBalanceChangesService: AccountBalanceChangesService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        AccountBalanceChangesService,
        TransactionsService,
        createMockServiceProvider(TransactionCategoriesService),
        createMockServiceProvider(TransactionCategoryMappingsService),
        createMockServiceProvider(AccountRepo),
        createMockServiceProvider(AccountBalanceChangeRepo),
        createMockServiceProvider(TransactionRepo),
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountRepo = module.get<jest.Mocked<AccountRepo>>(AccountRepo);
    accountBalanceChangeRepo = module.get<
      jest.Mocked<AccountBalanceChangeRepo>
    >(AccountBalanceChangeRepo);
    transactionRepo = module.get<jest.Mocked<TransactionRepo>>(TransactionRepo);
    accountBalanceChangesService = module.get<AccountBalanceChangesService>(
      AccountBalanceChangesService,
    );
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  it('should return an array of accounts from findAllByUser', async () => {
    jest
      .spyOn(accountRepo, 'findMany')
      .mockResolvedValueOnce(accountsRepoFindAllMockData);

    jest
      .spyOn(service, 'getCurrentDateAccountBalance')
      .mockResolvedValue(new Decimal(0));

    jest.spyOn(accountRepo, 'getCount').mockResolvedValueOnce(9);

    const accounts = await service.findAllByUser(DUMMY_TEST_USER.id);

    expect(accountRepo.findMany).toHaveBeenCalledTimes(1);
    expect(accountRepo.findMany).toHaveBeenCalledWith({
      where: {
        isDeleted: false,
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accounts).toMatchSnapshot();
  });

  it('should return an account from findOneWithCurrentBalance', async () => {
    const id = '61460d8554ea082ad0256759';

    jest
      .spyOn(accountRepo, 'findOne')
      .mockResolvedValueOnce(accountsRepoFindById[id]);

    jest
      .spyOn(accountBalanceChangesService, 'findAllByUserAndAccount')
      .mockResolvedValueOnce([]);

    jest
      .spyOn(transactionsService, 'findTransactionSummariesByUserAccount')
      .mockResolvedValueOnce([]);

    const account = await service.findOneWithCurrentBalance(
      DUMMY_TEST_USER.id,
      id,
    );

    expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
    expect(accountRepo.findOne).toHaveBeenCalledWith({
      id: '61460d8554ea082ad0256759',
      userId: '61460d7354ea082ad0256749',
    });

    expect(account).toMatchSnapshot();
  });

  it('should return an array of account balance history from getAccountBalanceHistory', async () => {
    const id = '61460d8554ea082ad0256759';

    jest.spyOn(transactionsService, 'findAllByUser').mockResolvedValueOnce([]);

    jest.spyOn(accountBalanceChangeRepo, 'findMany').mockResolvedValueOnce([]);

    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByAccountIdMockData[id]);

    const accountBalanceHistory = await service.getAccountBalanceHistory(
      DUMMY_TEST_USER.id,
      accountsRepoFindById[id],
    );

    expect(accountBalanceChangeRepo.findMany).toHaveBeenCalledTimes(1);
    expect(accountBalanceChangeRepo.findMany).toHaveBeenCalledWith({
      where: {
        accountId: '61460d8554ea082ad0256759',
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findMany).toHaveBeenCalledWith({
      select: {
        amount: true,
        date: true,
        fromAccount: true,
        id: true,
        toAccount: true,
      },
      where: {
        OR: [
          {
            toAccount: '61460d8554ea082ad0256759',
          },
          {
            fromAccount: '61460d8554ea082ad0256759',
          },
        ],
        date: undefined,
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountBalanceHistory).toMatchSnapshot();
  });
});
