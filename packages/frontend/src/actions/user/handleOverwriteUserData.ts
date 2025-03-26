'use server';

import {
  SchemaAccountBalanceChangeDto,
  SchemaAccountDto,
  SchemaTransactionCategoryDto,
  SchemaTransactionCategoryMappingDto,
  SchemaTransactionDto,
  SchemaTransactionTemplateDto,
  SchemaTransactionTemplateLogDto,
  SchemaUserPreferenceDto,
} from '@/api/ssr-financer-api';
import { DEBUG_overrideOwnUserData } from '@/api-service';
import { ValidationException } from '@/exceptions/validation.exception';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
export const handleOverwriteUserData: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  const accountBalanceChanges = JSON.parse(
    formData.get('accountBalanceChanges') as string,
  ) as SchemaAccountBalanceChangeDto[];

  const accounts = JSON.parse(
    formData.get('accounts') as string,
  ) as SchemaAccountDto[];

  const transactionCategories = JSON.parse(
    formData.get('transactionCategories') as string,
  ) as SchemaTransactionCategoryDto[];

  const transactionCategoryMappings = JSON.parse(
    formData.get('transactionCategoryMappings') as string,
  ) as SchemaTransactionCategoryMappingDto[];

  const transactions = JSON.parse(
    formData.get('transactions') as string,
  ) as SchemaTransactionDto[];

  const transactionTemplates = JSON.parse(
    formData.get('transactionTemplates') as string,
  ) as SchemaTransactionTemplateDto[];

  const userPreferences = JSON.parse(
    formData.get('userPreferences') as string,
  ) as SchemaUserPreferenceDto[];

  const transactionTemplateLogs = JSON.parse(
    formData.get('transactionTemplateLogs') as string,
  ) as SchemaTransactionTemplateLogDto[];

  try {
    await DEBUG_overrideOwnUserData({
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
