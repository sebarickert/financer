import { forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { AccountBalanceChangesModule } from '../account-balance-changes/account-balance-changes.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { AccountsService } from './accounts.service';
import { Account, AccountSchema } from './schemas/account.schema';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
        ]),
        AccountBalanceChangesModule,
        forwardRef(() => TransactionsModule),
      ],
      providers: [AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
