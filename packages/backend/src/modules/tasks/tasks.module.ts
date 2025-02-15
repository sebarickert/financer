import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

import { SystemModule } from '@/system/system.module';
import { TransactionTemplateModule } from '@/transaction-templates/transaction-templates.module';
import { TransactionsModule } from '@/transactions/transactions.module';

@Module({
  imports: [TransactionTemplateModule, TransactionsModule, SystemModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
