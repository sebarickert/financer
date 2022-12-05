import {
  AccountDto,
  TransactionCategoryDto,
  TransactionCategoryMappingDto,
  TransactionDto,
  TransactionTemplateDto,
  UserDto,
  UserPreferenceDto,
} from '@local/types';
import { ApiProperty } from '@nestjs/swagger';

import { AccountBalanceChangeDto } from '../../account-balance-changes/dto/account-balance-change.dto';

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
