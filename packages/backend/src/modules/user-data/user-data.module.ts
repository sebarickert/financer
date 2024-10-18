import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { AccountBalanceChangesModule } from '../account-balance-changes/account-balance-changes.module';
import { AccountsModule } from '../accounts/accounts.module';
import { TransactionCategoriesModule } from '../transaction-categories/transaction-categories.module';
import { TransactionCategoryMappingsModule } from '../transaction-category-mappings/transaction-category-mappings.module';
import { TransactionTemplateModule } from '../transaction-templates/transaction-templates.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';
import { UsersModule } from '../users/users.module';

import { UserDataService } from './user-data.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    AccountsModule,
    AccountBalanceChangesModule,
    TransactionsModule,
    TransactionCategoriesModule,
    TransactionCategoryMappingsModule,
    UserPreferencesModule,
    TransactionTemplateModule,
    DatabaseModule,
  ],
  providers: [UserDataService],
  exports: [UserDataService],
})
export class UserDataModule {}
