import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { TransactionsService } from './transactions.service';

import { AccountsService } from '@/accounts/accounts.service';
import { DUMMY_TEST_USER } from '@/config/mockAuthenticationMiddleware';
import { accountsRepoFindAllMockData } from '@/database/repos/mocks/account-repo-mock';
import { transactionCategoryRepoUserMockDataFindAllBy } from '@/database/repos/mocks/transaction-category-repo-mock';
import {
  transactionsRepoFindAllByIdMockData,
  transactionsRepoFindAllByTypeAndUserMockData,
} from '@/database/repos/mocks/transactions-repo-mock';
import { TransactionCategoryMappingRepo } from '@/modules/transaction-category-mappings/transaction-category-mapping.repo';
import { TransactionCategoryRepo } from '@/modules/transaction-categories/transaction-category.repo';
import { TransactionRepo } from '@/modules/transactions/transaction.repo';
import { createMockServiceProvider } from '@/test/create-mock-service-provider';
import { TransactionCategoriesService } from '@/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '@/transaction-category-mappings/transaction-category-mappings.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionRepo: jest.Mocked<TransactionRepo>;
  let transactionCategoriesRepo: jest.Mocked<TransactionCategoryRepo>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        TransactionCategoriesService,
        TransactionCategoryMappingsService,
        createMockServiceProvider(AccountsService),
        createMockServiceProvider(TransactionRepo),
        createMockServiceProvider(TransactionCategoryRepo),
        createMockServiceProvider(TransactionCategoryMappingRepo),
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    transactionRepo = module.get<jest.Mocked<TransactionRepo>>(TransactionRepo);
    transactionCategoriesRepo = module.get<
      jest.Mocked<TransactionCategoryRepo>
    >(TransactionCategoryRepo);
    accountsService = module.get<jest.Mocked<AccountsService>>(AccountsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should return all transactions for user', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByTypeAndUserMockData.any);
    jest.spyOn(transactionRepo, 'getCount').mockResolvedValueOnce(325);

    const transactions = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      null,
      NaN,
      NaN,
      NaN,
    );

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
      take: 325,
      where: {
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.getCount).toHaveBeenCalledTimes(1);
    expect(transactionRepo.getCount).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactions).toMatchSnapshot();
  });

  it('should return all transactions for user for specified account types', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByTypeAndUserMockData.any);
    jest.spyOn(transactionRepo, 'getCount').mockResolvedValueOnce(100);
    jest
      .spyOn(accountsService, 'findAllByUser')
      .mockResolvedValueOnce(accountsRepoFindAllMockData);

    const transactions = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      null,
      NaN,
      NaN,
      NaN,
      undefined,
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
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountsService.findAllByUser).toHaveBeenCalledTimes(1);
    expect(accountsService.findAllByUser).toHaveBeenCalledWith(
      '61460d7354ea082ad0256749',
      ['CASH', 'CREDIT', 'INVESTMENT', 'SAVINGS'],
    );

    expect(transactions).toMatchSnapshot();
  });

  it('should return monthly summaries for user', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByTypeAndUserMockData.any);

    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER.id,
      NaN,
      NaN,
      [],
    );

    expect(transactionRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findMany).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(summaries).toMatchSnapshot();
  });

  it('should return monthly summaries for user for specified account types', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(transactionsRepoFindAllByTypeAndUserMockData.any);
    jest
      .spyOn(accountsService, 'findAllByUser')
      .mockResolvedValueOnce(accountsRepoFindAllMockData);

    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER.id,
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
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountsService.findAllByUser).toHaveBeenCalledTimes(1);
    expect(accountsService.findAllByUser).toHaveBeenCalledWith(
      '61460d7354ea082ad0256749',
      ['CASH', 'CREDIT', 'INVESTMENT', 'SAVINGS'],
    );

    expect(summaries).toMatchSnapshot();
  });

  it('should return one transaction for user', async () => {
    const id = '624befb66ba655edad8f824e';

    jest
      .spyOn(transactionRepo, 'findOne')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockResolvedValueOnce(transactionsRepoFindAllByIdMockData[id]);

    jest
      .spyOn(transactionCategoriesRepo, 'findMany')
      .mockResolvedValueOnce(transactionCategoryRepoUserMockDataFindAllBy);

    const transaction = await service.findOne(DUMMY_TEST_USER.id, id);

    expect(transactionRepo.findOne).toHaveBeenCalledTimes(1);
    expect(transactionRepo.findOne).toHaveBeenCalledWith({
      include: {
        categories: {
          select: {
            amount: true,
            category: {
              select: {
                name: true,
              },
            },
            categoryId: true,
            description: true,
          },
        },
        from: {
          select: {
            name: true,
          },
        },
        to: {
          select: {
            name: true,
          },
        },
        transactionTemplateLog: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: '624befb66ba655edad8f824e',
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionCategoriesRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoriesRepo.findMany).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
        deleted: {
          not: true,
        },
        visibility: undefined,
      },
    });

    expect(transaction).toMatchSnapshot();
  });
});
