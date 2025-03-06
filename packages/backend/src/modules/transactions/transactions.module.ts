import { Module } from '@nestjs/common';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { AccountBalanceChangesService } from '@/account-balance-changes/account-balance-changes.service';
import { AccountsService } from '@/accounts/accounts.service';
import { DatabaseModule } from '@/database/database.module';
import { TransactionCategoriesService } from '@/transaction-categories/transaction-categories.service';
import { TransactionCategoryMappingsService } from '@/transaction-category-mappings/transaction-category-mappings.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    AccountsService,
    TransactionCategoriesService,
    TransactionCategoryMappingsService,
    AccountBalanceChangesService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
