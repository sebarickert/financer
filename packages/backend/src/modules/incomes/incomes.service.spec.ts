import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { accountsRepoFindAllMockData } from '../../database/repos/mocks/account-repo-mock';
import { transactionCategoryRepoUserMockDataFindAllBy } from '../../database/repos/mocks/transaction-category-repo-mock';
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

import { IncomesService } from './incomes.service';

describe('IncomesService', () => {
  let service: IncomesService;
  let transactionRepo: jest.Mocked<TransactionRepo>;
  let transactionCategoriesRepo: jest.Mocked<TransactionCategoryRepo>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomesService,
        TransactionsService,
        TransactionCategoriesService,
        TransactionCategoryMappingsService,
        createMockServiceProvider(AccountsService),
        createMockServiceProvider(TransactionRepo),
        createMockServiceProvider(TransactionCategoryRepo),
        createMockServiceProvider(TransactionCategoryMappingRepo),
      ],
    }).compile();

    service = module.get<IncomesService>(IncomesService);
    transactionRepo = module.get<jest.Mocked<TransactionRepo>>(TransactionRepo);
    transactionCategoriesRepo = module.get<
      jest.Mocked<TransactionCategoryRepo>
    >(TransactionCategoryRepo);
    accountsService = module.get<jest.Mocked<AccountsService>>(AccountsService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all incomes for user', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(
        transactionsRepoFindAllByTypeAndUserMockData.income,
      );
    jest.spyOn(transactionRepo, 'getCount').mockResolvedValueOnce(113);

    const incomes = await service.findAllByUser(
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
      take: 10000,
      where: {
        fromAccount: {
          equals: null,
        },
        toAccount: {
          not: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionRepo.getCount).toHaveBeenCalledTimes(1);
    expect(transactionRepo.getCount).toHaveBeenCalledWith({
      where: {
        fromAccount: {
          equals: null,
        },
        toAccount: {
          not: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(incomes).toMatchSnapshot();
  });

  it('should return all incomes for user for specified account types', async () => {
    jest
      .spyOn(transactionRepo, 'findMany')
      .mockResolvedValueOnce(
        transactionsRepoFindAllByTypeAndUserMockData.income,
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

    const incomes = await service.findAllByUser(
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
      take: 10000,
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
          equals: null,
        },
        toAccount: {
          not: null,
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
          equals: null,
        },
        toAccount: {
          not: null,
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(accountsService.findAllByUser).toHaveBeenCalledTimes(1);
    expect(accountsService.findAllByUser).toHaveBeenCalledWith(
      '61460d7354ea082ad0256749',
      ['CASH', 'CREDIT', 'INVESTMENT', 'SAVINGS'],
    );

    expect(incomes).toMatchSnapshot();
  });

  it('should return one income for user', async () => {
    const id = '663df5ccd8ef53dcb2bc93a0';

    jest
      .spyOn(transactionRepo, 'findOne')
      .mockResolvedValueOnce(transactionsRepoFindAllByIdMockData[id]);

    jest
      .spyOn(transactionCategoriesRepo, 'findMany')
      .mockResolvedValueOnce(transactionCategoryRepoUserMockDataFindAllBy);

    const income = await service.findOne(DUMMY_TEST_USER.id, id);

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
        id: '663df5ccd8ef53dcb2bc93a0',
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

    expect(income).toMatchSnapshot();
  });
});
