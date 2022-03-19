import { Module } from '@nestjs/common';

import { TransactionsModule } from '../transactions/transactions.module';

import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [TransactionsModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
