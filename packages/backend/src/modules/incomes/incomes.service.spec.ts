import { AccountType } from '@local/types';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { parseObjectId } from '../../types/objectId';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { IncomesService } from './incomes.service';

describe('IncomesService', () => {
  let service: IncomesService;

  beforeEach(async () => {
    jest.useFakeTimers({
      // do not fake nextTick behavior for mongo in memory
      doNotFake: ['nextTick'],
      now: new Date('2022-01-30T11:00:00.00Z'),
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        TransactionsModule,
        AccountsModule,

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [IncomesService],
    }).compile();

    service = module.get<IncomesService>(IncomesService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER._id,
      fixtureData as unknown as ImportUserDataDto,
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return all incomes for user', async () => {
    const incomes = await service.findAllByUser(
      DUMMY_TEST_USER._id,
      NaN,
      10000,
      NaN,
      NaN,
      [],
    );
    expect(incomes).toMatchSnapshot();
  });

  it('should return all incomes for user for specified account types', async () => {
    const incomes = await service.findAllByUser(
      DUMMY_TEST_USER._id,
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
    expect(incomes).toMatchSnapshot();
  });

  it('should return monthly summaries for user', async () => {
    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER._id,
      10000,
      NaN,
      NaN,
      [],
    );
    expect(summaries).toMatchSnapshot();
  });

  it('should return monthly summaries for user for specified account types', async () => {
    const summaries = await service.findMonthlySummariesByUser(
      DUMMY_TEST_USER._id,
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
      DUMMY_TEST_USER._id,
      parseObjectId('663df5ccd8ef53dcb2bc93a0'),
    );
    expect(expense).toMatchSnapshot();
  });
});
