import { Test, TestingModule } from '@nestjs/testing';

import { rootMongooseTestModule } from '../../../test/rootMongooseTest.module';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { TransfersService } from './transfers.service';

describe('TransfersService', () => {
  let service: TransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), AccountsModule, TransactionsModule],
      providers: [TransfersService],
    }).compile();

    service = module.get<TransfersService>(TransfersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
