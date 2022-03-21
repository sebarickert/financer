import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [TransactionsModule, AccountsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
