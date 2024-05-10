import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { parseObjectId } from '../../types/objectId';
import { AccountBalanceChangesModule } from '../account-balance-changes/account-balance-changes.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { AccountsService } from './accounts.service';
import { Account, AccountSchema } from './schemas/account.schema';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    jest.useFakeTimers({
      // do not fake nextTick behavior for mongo in memory
      doNotFake: ['nextTick'],
      now: new Date('2022-01-30T11:00:00.00Z'),
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
        ]),
        AccountBalanceChangesModule,
        forwardRef(() => TransactionsModule),

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER._id,
      fixtureData as unknown as ImportUserDataDto,
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return an array of accounts from findAllByUser', async () => {
    const accounts = await service.findAllByUser(DUMMY_TEST_USER._id);
    expect(accounts).toMatchSnapshot();
  });

  it('should return an account from findOne', async () => {
    const account = await service.findOne(
      DUMMY_TEST_USER._id,
      parseObjectId('61460d8554ea082ad0256759'),
    );
    expect(account).toMatchSnapshot();
  });

  it('should return an array of account balance history from getAccountBalanceHistory', async () => {
    const accountBalanceHistory = await service.getAccountBalanceHistory(
      DUMMY_TEST_USER._id,
      parseObjectId('61460d8554ea082ad0256759'),
    );
    expect(accountBalanceHistory).toMatchSnapshot();
  });
});
