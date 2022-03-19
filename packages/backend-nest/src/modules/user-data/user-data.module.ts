import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/modules/accounts/accounts.module';
import { TransactionCategoriesModule } from 'src/modules/transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from 'src/modules/transaction-category-mappings/transaction-category-mappings.module';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';

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
