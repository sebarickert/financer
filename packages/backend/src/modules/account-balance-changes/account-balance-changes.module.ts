import { Module } from '@nestjs/common';

import { AccountBalanceChangesService } from './account-balance-changes.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [AccountBalanceChangesService],
  exports: [AccountBalanceChangesService],
})
export class AccountBalanceChangesModule {}
