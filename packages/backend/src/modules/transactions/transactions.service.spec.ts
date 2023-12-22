import { AccountType, TransactionType } from '@local/types';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Transaction.name, schema: TransactionSchema },
        ]),
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
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return all expenses for user', async () => {
    const expenses = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      TransactionType.ANY,
      NaN,
      10000,
      NaN,
      NaN,
    );
    expect(expenses).toMatchSnapshot();
  });

  it('should return all expenses for user for specified account types', async () => {
    const expenses = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      TransactionType.ANY,
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
    expect(expenses).toMatchSnapshot();
  });

  it('should return monthly summaries for user', async () => {
    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER.id,
      TransactionType.ANY,
      10000,
      NaN,
      NaN,
      [],
    );
    expect(summaries).toMatchSnapshot();
  });

  it('should return monthly summaries for user for specified account types', async () => {
    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER.id,
      TransactionType.TRANSFER,
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
    expect(summaries).toMatchSnapshot();
  });

  it('should return one expense for user', async () => {
    const expense = await service.findOne(
      DUMMY_TEST_USER.id,
      '624befb66ba655edad8f824e',
    );
    expect(expense).toMatchSnapshot();
  });
});
