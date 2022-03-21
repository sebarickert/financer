import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [TransactionsModule, AccountsModule],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
