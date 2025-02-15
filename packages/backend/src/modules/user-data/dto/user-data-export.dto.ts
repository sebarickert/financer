import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

import { AccountBalanceChangeDto } from '@/account-balance-changes/dto/account-balance-change.dto';
import { AccountDto } from '@/accounts/dto/account.dto';
import { TransactionCategoryDto } from '@/transaction-categories/dto/transaction-category.dto';
import { TransactionCategoryMappingDto } from '@/transaction-category-mappings/dto/transaction-category-mapping.dto';
import { TransactionTemplateLogDto } from '@/transaction-templates/dto/transaction-template-log.dto';
import { TransactionTemplateDto } from '@/transaction-templates/dto/transaction-template.dto';
import { TransactionDto } from '@/transactions/dto/transaction.dto';
import { UserPreferenceDto } from '@/user-preferences/dto/user-preference.dto';
import { UserDto } from '@/users/dto/user.dto';

export class UserDataExportDto {
  @ApiProperty()
  @Allow()
  user!: UserDto;

  @ApiProperty({ type: [UserPreferenceDto] })
  @Allow()
  userPreferences!: UserPreferenceDto[];

  @ApiProperty({ type: [TransactionDto] })
  @Allow()
  transactions!: TransactionDto[];

  @ApiProperty({ type: [AccountDto] })
  @Allow()
  accounts!: AccountDto[];

  @ApiProperty({ type: [AccountBalanceChangeDto] })
  @Allow()
  accountBalanceChanges!: AccountBalanceChangeDto[];

  @ApiProperty({ type: [TransactionCategoryDto] })
  @Allow()
  transactionCategories!: TransactionCategoryDto[];

  @ApiProperty({ type: [TransactionCategoryMappingDto] })
  @Allow()
  transactionCategoryMappings!: TransactionCategoryMappingDto[];

  @ApiProperty({ type: [TransactionTemplateDto] })
  @Allow()
  transactionTemplates!: TransactionTemplateDto[];

  @ApiProperty({ type: [TransactionTemplateLogDto] })
  @Allow()
  transactionTemplateLogs!: TransactionTemplateLogDto[];
}
