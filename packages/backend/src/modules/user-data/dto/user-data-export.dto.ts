import { ApiProperty } from '@nestjs/swagger';

import { AccountBalanceChangeDto } from '../../account-balance-changes/dto/account-balance-change.dto';
import { AccountDto } from '../../accounts/dto/account.dto';
import { TransactionCategoryDto } from '../../transaction-categories/dto/transaction-category.dto';
import { TransactionCategoryMappingDto } from '../../transaction-category-mappings/dto/transaction-category-mapping.dto';
import { TransactionTemplateDto } from '../../transaction-templates/dto/transaction-template.dto';
import { TransactionDto } from '../../transactions/dto/transaction.dto';
import { UserPreferenceDto } from '../../user-preferences/dto/user-preference.dto';
import { UserDto } from '../../users/dto/user.dto';

export class UserDataExportDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty({ type: [UserPreferenceDto] })
  userPreferences: UserPreferenceDto[];

  @ApiProperty({ type: [TransactionDto] })
  transactions: TransactionDto[];

  @ApiProperty({ type: [AccountDto] })
  accounts: AccountDto[];

  @ApiProperty({ type: [AccountBalanceChangeDto] })
  accountBalanceChanges: AccountBalanceChangeDto[];

  @ApiProperty({ type: [TransactionCategoryDto] })
  transactionCategories: TransactionCategoryDto[];

  @ApiProperty({ type: [TransactionCategoryMappingDto] })
  transactionCategoryMappings: TransactionCategoryMappingDto[];

  @ApiProperty({ type: [TransactionTemplateDto] })
  transactionTemplates: TransactionTemplateDto[];
}
