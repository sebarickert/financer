import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountType } from '@prisma/client';

import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { testConfiguration } from '../../config/test-configuration';
import fixtureData from '../../fixtures/large_fixture-data.json';
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
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
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
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return all incomes for user', async () => {
    const incomes = await service.findAllByUser(
      DUMMY_TEST_USER.id,
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
    expect(incomes).toMatchSnapshot();
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

  it('should return one income for user', async () => {
    const income = await service.findOne(
      DUMMY_TEST_USER.id,
      '663df5ccd8ef53dcb2bc93a0',
    );
    expect(income).toMatchSnapshot();
  });
});
