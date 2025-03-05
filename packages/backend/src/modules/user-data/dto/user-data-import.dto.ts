import { OmitType } from '@nestjs/swagger';

import { UserDataExportDto } from './user-data-export.dto';

export class UserDataImportDto extends OmitType(UserDataExportDto, [
  'user',
] as const) {
  constructor(data?: UserDataImportDto) {
    super();
    if (data) {
      this.accountBalanceChanges = data.accountBalanceChanges;
      this.accounts = data.accounts;
      this.transactionCategories = data.transactionCategories;
      this.transactionCategoryMappings = data.transactionCategoryMappings;
      this.transactionTemplateLogs = data.transactionTemplateLogs;
      this.transactionTemplates = data.transactionTemplates;
      this.transactions = data.transactions;
      this.userPreferences = data.userPreferences;
    }
  }
}
