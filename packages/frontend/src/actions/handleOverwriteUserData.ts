'use server';

import {
  AccountBalanceChangeDto,
  AccountDto,
  TransactionCategoryDto,
  TransactionCategoryMappingDto,
  TransactionDto,
  TransactionTemplateDto,
  UserPreferenceDto,
  TransactionTemplateLogDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserService } from '$ssr/api/user.service';

export const handleOverwriteUserData: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  const accountBalanceChanges = JSON.parse(
    formData.get('accountBalanceChanges') as string,
  ) as AccountBalanceChangeDto[];

  const accounts = JSON.parse(
    formData.get('accounts') as string,
  ) as AccountDto[];

  const transactionCategories = JSON.parse(
    formData.get('transactionCategories') as string,
  ) as TransactionCategoryDto[];

  const transactionCategoryMappings = JSON.parse(
    formData.get('transactionCategoryMappings') as string,
  ) as TransactionCategoryMappingDto[];

  const transactions = JSON.parse(
    formData.get('transactions') as string,
  ) as TransactionDto[];

  const transactionTemplates = JSON.parse(
    formData.get('transactionTemplates') as string,
  ) as TransactionTemplateDto[];

  const userPreferences = JSON.parse(
    formData.get('userPreferences') as string,
  ) as UserPreferenceDto[];

  const transactionTemplateLogs = JSON.parse(
    formData.get('transactionTemplateLogs') as string,
  ) as TransactionTemplateLogDto[];

  try {
    await UserService.DEBUG_overrideOwnUserData({
      accountBalanceChanges,
      accounts,
      transactionCategories,
      transactionCategoryMappings,
      transactions,
      transactionTemplates,
      userPreferences,
      transactionTemplateLogs,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return { status: 'ERROR', errors: error.errors };
    }

    console.error(error);
    return { status: 'ERROR', errors: ['Something went wrong'] };
  }

  return { status: 'OK' };
};
