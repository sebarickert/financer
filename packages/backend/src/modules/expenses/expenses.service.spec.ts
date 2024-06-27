import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { removeCreatedAndUpdated } from '../../../test/test-helper';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { testConfiguration } from '../../config/test-configuration';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        TransactionsModule,

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [ExpensesService],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  it('should return all expenses for user', async () => {
    const expenses = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      NaN,
      10000,
      NaN,
      NaN,
      [],
    );
    expect(removeCreatedAndUpdated(expenses)).toMatchSnapshot();
  });

  it('should return all expenses for user for specified account types', async () => {
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
    expect(removeCreatedAndUpdated(expenses)).toMatchSnapshot();
  });

  it('should return one expense for user', async () => {
    const expense = await service.findOne(
      DUMMY_TEST_USER.id,
      '624befb66ba655edad8f824e',
    );
    expect(removeCreatedAndUpdated(expense)).toMatchSnapshot();
  });
});
