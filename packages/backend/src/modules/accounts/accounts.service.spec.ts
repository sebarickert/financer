import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { AccountBalanceChangeRepo } from '../../database/repos/account-balance-change.repo';
import { AccountRepo } from '../../database/repos/account.repo';
import {
  accountsRepoFindAllMockData,
  accountsRepoFindById,
} from '../../database/repos/mocks/account-repo-mock';
import { transactionsRepoFindAllByAccountIdMockData } from '../../database/repos/mocks/transactions-repo-mock';
import { TransactionRepo } from '../../database/repos/transaction.repo';
import { AccountBalanceChangesService } from '../account-balance-changes/account-balance-changes.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';
import { TransactionsService } from '../transactions/transactions.service';

import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountRepo: jest.Mocked<AccountRepo>;
  let accountBalanceChangeRepo: jest.Mocked<AccountBalanceChangeRepo>;
  let transactionRepo: jest.Mocked<TransactionRepo>;

  beforeAll(async () => {
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of accounts from findAllByUser', async () => {
    jest
      .spyOn(accountRepo, 'findMany')
      .mockResolvedValueOnce(accountsRepoFindAllMockData);
    jest.spyOn(accountRepo, 'getCount').mockResolvedValueOnce(9);

    const accounts = await service.findAllByUser(DUMMY_TEST_USER.id);

    expect(accountRepo.findMany).toHaveBeenCalledTimes(1);
    expect(accountRepo.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 20,
      where: {
        isDeleted: false,
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountRepo.getCount).toHaveBeenCalledTimes(1);
    expect(accountRepo.getCount).toHaveBeenCalledWith({
      where: {
        isDeleted: false,
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accounts).toMatchSnapshot();
  });

  it('should return an account from findOne', async () => {
    const id = '61460d8554ea082ad0256759';

    jest
      .spyOn(accountRepo, 'findOne')
      .mockResolvedValueOnce(accountsRepoFindById[id]);

    const account = await service.findOne(DUMMY_TEST_USER.id, id);

    expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
    expect(accountRepo.findOne).toHaveBeenCalledWith({
      id: '61460d8554ea082ad0256759',
      userId: '61460d7354ea082ad0256749',
    });

    expect(account).toMatchSnapshot();
  });

  it('should return an array of account balance history from getAccountBalanceHistory', async () => {
    const id = '61460d8554ea082ad0256759';

    jest
      .spyOn(accountRepo, 'findOne')
      .mockResolvedValueOnce(accountsRepoFindById[id]);

    jest.spyOn(accountBalanceChangeRepo, 'findMany').mockResolvedValueOnce([]);

    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByAccountIdMockData[id]);

    const accountBalanceHistory = await service.getAccountBalanceHistory(
      DUMMY_TEST_USER.id,
      id,
    );

    expect(accountRepo.findOne).toHaveBeenCalledTimes(1);
    expect(accountRepo.findOne).toHaveBeenCalledWith({
      id: '61460d8554ea082ad0256759',
      userId: '61460d7354ea082ad0256749',
    });

    expect(accountBalanceChangeRepo.findMany).toHaveBeenCalledTimes(1);
    expect(accountBalanceChangeRepo.findMany).toHaveBeenCalledWith({
      where: {
        accountId: '61460d8554ea082ad0256759',
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findMany).toHaveBeenCalledWith({
      include: {
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
            categoryId: true,
          },
        },
        transactionTemplateLog: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
      skip: 0,
      take: undefined,
      where: {
        OR: [
          {
            toAccount: '61460d8554ea082ad0256759',
          },
          {
            fromAccount: '61460d8554ea082ad0256759',
          },
        ],
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountBalanceHistory).toMatchSnapshot();
  });
});
