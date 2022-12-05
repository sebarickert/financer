import { Module } from '@nestjs/common';

import { TransactionTemplateModule } from '../transaction-templates/transaction-templates.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TransactionTemplateModule, TransactionsModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
