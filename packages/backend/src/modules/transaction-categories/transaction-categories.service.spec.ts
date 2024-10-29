import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { transactionCategoryMappingRepoFindAllByUserIdTransactionData } from '../../database/repos/mocks/transaction-category-mapping-repo-mock';
import {
  transactionCategoryRepoMockDataFindById,
  transactionCategoryRepoUserMockDataFindAllBy,
} from '../../database/repos/mocks/transaction-category-repo-mock';
import { TransactionCategoryMappingRepo } from '../../database/repos/transaction-category-mapping.repo';
import { TransactionCategoryRepo } from '../../database/repos/transaction-category.repo';
import { TransactionCategoryMappingsService } from '../transaction-category-mappings/transaction-category-mappings.service';

import { TransactionCategoriesService } from './transaction-categories.service';

describe('TransactionCategoriesService', () => {
  let service: TransactionCategoriesService;
  let transactionCategoryRepo: jest.Mocked<TransactionCategoryRepo>;
  let transactionCategoryMappingRepo: jest.Mocked<TransactionCategoryMappingRepo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCategoriesService,
        TransactionCategoryMappingsService,
        createMockServiceProvider(TransactionCategoryRepo),
        createMockServiceProvider(TransactionCategoryMappingRepo),
      ],
    }).compile();

    service = module.get<TransactionCategoriesService>(
      TransactionCategoriesService,
    );
    transactionCategoryRepo = module.get<jest.Mocked<TransactionCategoryRepo>>(
      TransactionCategoryRepo,
    );
    transactionCategoryMappingRepo = module.get<
      jest.Mocked<TransactionCategoryMappingRepo>
    >(TransactionCategoryMappingRepo);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a transaction category by id', async () => {
    const id = '623b58ada3deba9879422fbf';
    jest
      .spyOn(transactionCategoryRepo, 'findOne')
      .mockResolvedValue(transactionCategoryRepoMockDataFindById[id]);

    jest
      .spyOn(transactionCategoryRepo, 'findMany')
      .mockResolvedValue(transactionCategoryRepoUserMockDataFindAllBy);

    const transactionCategory = await service.findOne(DUMMY_TEST_USER.id, id);

    expect(transactionCategoryRepo.findOne).toHaveBeenCalledTimes(1);
    expect(transactionCategoryRepo.findOne).toHaveBeenCalledWith({
      id: '623b58ada3deba9879422fbf',
      userId: '61460d7354ea082ad0256749',
    });

    expect(transactionCategoryRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryRepo.findMany).toHaveBeenCalledWith({
      where: {
        deleted: {
          not: true,
        },
        userId: '61460d7354ea082ad0256749',
        visibility: undefined,
      },
    });

    expect(transactionCategory).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findAllByUser', async () => {
    jest
      .spyOn(transactionCategoryRepo, 'findMany')
      .mockResolvedValue(transactionCategoryRepoUserMockDataFindAllBy);

    const transactionCategories = await service.findAllByUser(
      DUMMY_TEST_USER.id,
    );

    expect(transactionCategoryRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryRepo.findMany).toHaveBeenCalledWith({
      where: {
        deleted: {
          not: true,
        },
        userId: '61460d7354ea082ad0256749',
        visibility: undefined,
      },
    });

    expect(transactionCategories).toMatchSnapshot();
  });

  it('should return an array of transaction categories from findMonthlySummariesByUserAndId', async () => {
    jest.spyOn(transactionCategoryRepo, 'findMany').mockResolvedValue([]);
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValue(
        transactionCategoryMappingRepoFindAllByUserIdTransactionData,
      );

    const transactionCategories = await service.findMonthlySummariesByUserAndId(
      DUMMY_TEST_USER.id,
      '623b58ada3deba9879422fbf',
    );

    expect(transactionCategoryRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryRepo.findMany).toHaveBeenCalledWith({
      where: {
        parentCategoryId: {
          in: ['623b58ada3deba9879422fbf'],
        },
      },
    });

    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledWith({
      include: {
        transaction: {
          select: {
            date: true,
            fromAccount: true,
            toAccount: true,
          },
        },
      },
      where: {
        categoryId: {
          in: ['623b58ada3deba9879422fbf'],
        },
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionCategories).toMatchSnapshot();
  });
});
