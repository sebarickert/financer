import { Test, TestingModule } from '@nestjs/testing';

import { createMockServiceProvider } from '../../../test/create-mock-service-provider';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import {
  transactionCategoryMappingRepoFindAllByUserId,
  transactionCategoryMappingRepoFindAllByUserIdTransactionData,
} from '../../database/repos/mocks/transaction-category-mapping-repo-mock';
import { TransactionCategoryMappingRepo } from '../../database/repos/transaction-category-mapping.repo';

import { TransactionCategoryMappingsService } from './transaction-category-mappings.service';

describe('TransactionCategoryMappingsService', () => {
  let service: TransactionCategoryMappingsService;
  let transactionCategoryMappingRepo: jest.Mocked<TransactionCategoryMappingRepo>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionCategoryMappingsService,
        createMockServiceProvider(TransactionCategoryMappingRepo),
      ],
    }).compile();

    service = module.get<TransactionCategoryMappingsService>(
      TransactionCategoryMappingsService,
    );
    transactionCategoryMappingRepo = module.get<
      jest.Mocked<TransactionCategoryMappingRepo>
    >(TransactionCategoryMappingRepo);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all transactionCategoryMappings by user', async () => {
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValue(transactionCategoryMappingRepoFindAllByUserId);

    const transactionCategoryMappings = await service.findAllByUser(
      DUMMY_TEST_USER.id,
    );

    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
      },
    });

    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return all transactionCategoryMappings by user and category ids', async () => {
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValue(transactionCategoryMappingRepoFindAllByUserId);

    const transactionCategoryMappings =
      await service.findAllByUserAndCategoryIds(DUMMY_TEST_USER.id, [
        '623b58ada3deba9879422fbf',
      ]);

    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
        categoryId: {
          in: ['623b58ada3deba9879422fbf'],
        },
      },
    });

    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return all transactionCategoryMappings by user and transaction id', async () => {
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValue(transactionCategoryMappingRepoFindAllByUserId);

    const transactionCategoryMappings =
      await service.findAllByUserAndTransaction(
        DUMMY_TEST_USER.id,
        '624befb66ba655edad8f824e',
      );

    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledTimes(1);
    expect(transactionCategoryMappingRepo.findMany).toHaveBeenCalledWith({
      where: {
        userId: '61460d7354ea082ad0256749',
        transactionId: '624befb66ba655edad8f824e',
      },
    });

    expect(transactionCategoryMappings).toMatchSnapshot();
  });

  it('should return transaction category monthly summary by user and category ids', async () => {
    jest
      .spyOn(transactionCategoryMappingRepo, 'findMany')
      .mockResolvedValue(
        transactionCategoryMappingRepoFindAllByUserIdTransactionData,
      );

    const transactionCategoryMappings =
      await service.findMonthlySummariesByUserAndId(DUMMY_TEST_USER.id, [
        '623b58ada3deba9879422fbf',
      ]);

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

    expect(transactionCategoryMappings).toMatchSnapshot();
  });
});
