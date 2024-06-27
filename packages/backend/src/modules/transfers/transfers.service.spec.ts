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

import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  let service: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        TransactionsModule,

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [TransfersService],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  it('should return all transfers for user', async () => {
    const transfers = await service.findAllByUser(
      DUMMY_TEST_USER.id,
      NaN,
      10000,
      NaN,
      NaN,
      [],
    );
    expect(removeCreatedAndUpdated(transfers)).toMatchSnapshot();
  });

  it('should return all transfers for user for specified account types', async () => {
    const transfers = await service.findAllByUser(
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
    expect(removeCreatedAndUpdated(transfers)).toMatchSnapshot();
  });

  it('should return one transfer for user', async () => {
    const transfer = await service.findOne(
      DUMMY_TEST_USER.id,
      '663df679d8ef53dcb2bc9411',
    );
    expect(removeCreatedAndUpdated(transfer)).toMatchSnapshot();
  });
});
