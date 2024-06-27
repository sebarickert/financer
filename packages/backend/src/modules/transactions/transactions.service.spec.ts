import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
        AccountsModule,
        TransactionCategoriesModule,
        TransactionCategoryMappingsModule,

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return all transactions for user', async () => {
    const transactions = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      null,
      NaN,
      10000,
      NaN,
      NaN,
    );
    expect(transactions).toMatchSnapshot();
  });

  it('should return all transactions for user for specified account types', async () => {
    const transactions = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      null,
      NaN,
      10000,
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
    expect(transactions).toMatchSnapshot();
  });

  it('should return monthly summaries for user', async () => {
    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER.id,
      NaN,
      NaN,
      [],
    );
    expect(summaries).toMatchSnapshot();
  });

  it('should return monthly summaries for user for specified account types', async () => {
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
    expect(summaries).toMatchSnapshot();
  });

  it('should return one transaction for user', async () => {
    const transaction = await service.findOne(
      DUMMY_TEST_USER.id,
      '624befb66ba655edad8f824e',
    );
    expect(transaction).toMatchSnapshot();
  });
});
