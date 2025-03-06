import { Module } from '@nestjs/common';

import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

import { TransactionsModule } from '@/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
