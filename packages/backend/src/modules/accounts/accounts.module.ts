import { Module, forwardRef } from '@nestjs/common';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

import { AccountBalanceChangesModule } from '@/account-balance-changes/account-balance-changes.module';
import { DatabaseModule } from '@/database/database.module';
import { TransactionsModule } from '@/transactions/transactions.module';

@Module({
  imports: [
    DatabaseModule,
    AccountBalanceChangesModule,
    forwardRef(() => TransactionsModule),
  ],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
