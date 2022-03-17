import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionCategoriesModule } from 'src/transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from 'src/transaction-category-mappings/transaction-category-mappings.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

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
