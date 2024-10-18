import { Module } from '@nestjs/common';

import { PrismaTransactionService } from './prisma-transaction.service';
import { PrismaService } from './prisma.service';
import { AccountBalanceChangeRepo } from './repos/account-balance-change.repo';
import { AccountRepo } from './repos/account.repo';
import { SystemLogRepo } from './repos/system-log.repo';
import { TransactionCategoryMappingRepo } from './repos/transaction-category-mapping.repo';
import { TransactionCategoryRepo } from './repos/transaction-category.repo';
import { TransactionTemplateLogRepo } from './repos/transaction-template-log.repo';
import { TransactionTemplateRepo } from './repos/transaction-template.repo';
import { TransactionRepo } from './repos/transaction.repo';
import { UserPreferencesRepo } from './repos/user-preferences.repo';
import { UserRepo } from './repos/user.repo';

@Module({
  providers: [
    PrismaService,
    UserRepo,
    AccountBalanceChangeRepo,
    AccountRepo,
    SystemLogRepo,
    UserPreferencesRepo,
    TransactionCategoryRepo,
    TransactionCategoryMappingRepo,
    TransactionTemplateRepo,
    TransactionTemplateLogRepo,
    TransactionRepo,
    PrismaTransactionService,
  ],
  exports: [
    UserRepo,
    AccountBalanceChangeRepo,
    AccountRepo,
    SystemLogRepo,
    UserPreferencesRepo,
    TransactionCategoryRepo,
    TransactionCategoryMappingRepo,
    TransactionTemplateRepo,
    TransactionTemplateLogRepo,
    TransactionRepo,
    PrismaTransactionService,
  ],
})
export class DatabaseModule {}
