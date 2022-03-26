import { Module } from '@nestjs/common';

import { AccountsModule } from '../accounts/accounts.module';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';
import { TransactionsModule } from '../transactions/transactions.module';

import { UserDataService } from './user-data.service';

@Module({
  imports: [
    AccountsModule,
    TransactionsModule,
    TransactionCategoriesModule,
    TransactionCategoryMappingsModule,
  ],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
