import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { removeCreatedAndUpdated } from '../../../test/test-helper';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { accountsRepoFindAllMockData } from '../../database/repos/mocks/account-repo-mock';
import { transactionCategoryMappingRepoFindByIdMock } from '../../database/repos/mocks/transaction-category-mapping-repo-mock';
import {
  transactionsRepoFindAllByIdMockData,
  transactionsRepoFindAllByTypeAndUserMockData,
} from '../../database/repos/mocks/transactions-repo-mock';
import { TransactionCategoryMappingRepo } from '../../database/repos/transaction-category-mapping.repo';
import { TransactionCategoryRepo } from '../../database/repos/transaction-category.repo';
import { TransactionRepo } from '../../database/repos/transaction.repo';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionCategoriesService } from '../transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';
import { TransactionsService } from '../transactions/transactions.service';

import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let transactionRepo: jest.Mocked<TransactionRepo>;
  let transactionCategoryMappingRepo: jest.Mocked<TransactionCategoryMappingRepo>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        TransactionsService,
        TransactionCategoriesService,
        TransactionCategoryMappingsService,
        createMockServiceProvider(AccountsService),
        createMockServiceProvider(TransactionRepo),
        createMockServiceProvider(TransactionCategoryRepo),
        createMockServiceProvider(TransactionCategoryMappingRepo),
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    transactionRepo = module.get<jest.Mocked<TransactionRepo>>(TransactionRepo);
    transactionCategoryMappingRepo = module.get<
      jest.Mocked<TransactionCategoryMappingRepo>
    >(TransactionCategoryMappingRepo);
    accountsService = module.get<jest.Mocked<AccountsService>>(AccountsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all expenses for user', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(
        transactionsRepoFindAllByTypeAndUserMockData.expense,
      );
    jest.spyOn(transactionRepo, 'getCount').mockResolvedValueOnce(100);

    const expenses = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      NaN,
      10000,
      NaN,
      NaN,
      [],
    );

    expect(transactionRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findMany).toHaveBeenCalledWith({
      include: {
        categories: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip: 0,
      take: 100,
      where: {
        fromAccount: {
          not: null,
        },
        toAccount: {
          equals: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.getCount).toHaveBeenCalledTimes(1);
    expect(transactionRepo.getCount).toHaveBeenCalledWith({
      where: {
        fromAccount: {
          not: null,
        },
        toAccount: {
          equals: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(removeCreatedAndUpdated(expenses)).toMatchSnapshot();
  });

  it('should return all expenses for user for specified account types', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(
        transactionsRepoFindAllByTypeAndUserMockData.expense,
      );
    jest.spyOn(transactionRepo, 'getCount').mockResolvedValueOnce(100);
    jest.spyOn(accountsService, 'findAllByUser').mockResolvedValueOnce({
      data: accountsRepoFindAllMockData,
      limit: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      totalPageCount: 1,
      totalRowCount: 1,
    });

    const expenses = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      NaN,
      10000,
      NaN,
      NaN,
      [
        AccountType.CASH,
        AccountType.CREDIT,
        AccountType.INVESTMENT,
        AccountType.SAVINGS,
      ],
    );

    expect(transactionRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findMany).toHaveBeenCalledWith({
      include: {
        categories: true,
      },
      orderBy: {
        date: 'desc',
      },
      skip: 0,
      take: 100,
      where: {
        OR: [
          {
            toAccount: {
              in: [
                '61460d8554ea082ad0256759',
                '61460d9454ea082ad0256762',
                '61460da354ea082ad025676b',
                '61460db554ea082ad0256774',
                '61460dd554ea082ad025677d',
                '61460de154ea082ad0256786',
                '663df55ad8ef53dcb2bc9347',
                '663df623d8ef53dcb2bc93c0',
                '663df62cd8ef53dcb2bc93c4',
              ],
            },
          },
          {
            fromAccount: {
              in: [
                '61460d8554ea082ad0256759',
                '61460d9454ea082ad0256762',
                '61460da354ea082ad025676b',
                '61460db554ea082ad0256774',
                '61460dd554ea082ad025677d',
                '61460de154ea082ad0256786',
                '663df55ad8ef53dcb2bc9347',
                '663df623d8ef53dcb2bc93c0',
                '663df62cd8ef53dcb2bc93c4',
              ],
            },
          },
        ],
        fromAccount: {
          not: null,
        },
        toAccount: {
          equals: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.getCount).toHaveBeenCalledTimes(1);
    expect(transactionRepo.getCount).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            toAccount: {
              in: [
                '61460d8554ea082ad0256759',
                '61460d9454ea082ad0256762',
                '61460da354ea082ad025676b',
                '61460db554ea082ad0256774',
                '61460dd554ea082ad025677d',
                '61460de154ea082ad0256786',
                '663df55ad8ef53dcb2bc9347',
                '663df623d8ef53dcb2bc93c0',
                '663df62cd8ef53dcb2bc93c4',
              ],
            },
          },
          {
            fromAccount: {
              in: [
                '61460d8554ea082ad0256759',
                '61460d9454ea082ad0256762',
                '61460da354ea082ad025676b',
                '61460db554ea082ad0256774',
                '61460dd554ea082ad025677d',
                '61460de154ea082ad0256786',
                '663df55ad8ef53dcb2bc9347',
                '663df623d8ef53dcb2bc93c0',
                '663df62cd8ef53dcb2bc93c4',
              ],
            },
          },
        ],
        fromAccount: {
          not: null,
        },
        toAccount: {
          equals: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountsService.findAllByUser).toHaveBeenCalledTimes(1);
    expect(accountsService.findAllByUser).toHaveBeenCalledWith(
      '61460d7354ea082ad0256749',
      ['CASH', 'CREDIT', 'INVESTMENT', 'SAVINGS'],
    );

    expect(removeCreatedAndUpdated(expenses)).toMatchSnapshot();
  });

  it('should return one expense for user', async () => {
    const id = '624befb66ba655edad8f824e';

    jest
      .spyOn(transactionRepo, 'findOne')
      .mockResolvedValueOnce(transactionsRepoFindAllByIdMockData[id]);
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValueOnce(transactionCategoryMappingRepoFindByIdMock[id]);

    const expense = await service.findOne(DUMMY_TEST_USER.id, id);

    expect(transactionRepo.findOne).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findOne).toHaveBeenCalledWith({
      id: '624befb66ba655edad8f824e',
      userId: '61460d7354ea082ad0256749',
    });

    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledWith({
      where: {
        transactionId: '624befb66ba655edad8f824e',
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(removeCreatedAndUpdated(expense)).toMatchSnapshot();
  });
});
