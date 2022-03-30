import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountBalanceChangesService } from './account-balance-changes.service';
import {
  AccountBalanceChange,
  AccountBalanceChangeSchema,
} from './schemas/account-balance-change.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountBalanceChange.name, schema: AccountBalanceChangeSchema },
    ]),
  ],
  providers: [AccountBalanceChangesService],
  exports: [AccountBalanceChangesService],
})
export class AccountBalanceChangesModule {}
