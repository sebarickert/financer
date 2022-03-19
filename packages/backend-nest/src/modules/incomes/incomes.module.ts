import { Module } from '@nestjs/common';

import { TransactionsModule } from '../transactions/transactions.module';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

@Module({
  imports: [TransactionsModule],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
