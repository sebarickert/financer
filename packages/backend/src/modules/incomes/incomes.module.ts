import { Module } from '@nestjs/common';

import { IncomesController } from './incomes.controller';
import { IncomesService } from './incomes.service';

import { TransactionsModule } from '@/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [IncomesController],
  providers: [IncomesService],
})
export class IncomesModule {}
