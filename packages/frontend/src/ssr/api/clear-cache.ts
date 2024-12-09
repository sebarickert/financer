'use server';

import { revalidateTag } from 'next/cache';

import { BaseApi } from './BaseApi';

// TODO temporary solution to clear cache while migration

export const clearAccountCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.ACCOUNT);
};

export const clearAccountBalanceCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.ACCOUNT_BALANCE);
};

export const clearAuthenticationCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.AUTHENTICATION);
};

export const clearUserCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.USER);
};

export const clearUserPreferenceCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.USER_PREFERENCE);
};

export const clearTransactionTemplateCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.TRANSACTION_TEMPLATE);
};

export const clearTransactionCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.TRANSACTION);
};

export const clearIncomeCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.INCOME);
};

export const clearExpenseCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.EXPENSE);
};

export const clearTransferCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.TRANSFER);
};

export const clearCategoryCache = async (): Promise<void> => {
  revalidateTag(BaseApi.API_TAG.CATEGORY);
};

export const clearAllCaches = async (): Promise<void> => {
  await clearAccountCache();
  await clearAccountBalanceCache();
  await clearAuthenticationCache();
  await clearUserCache();
  await clearUserPreferenceCache();
  await clearTransactionTemplateCache();
  await clearTransactionCache();
  await clearIncomeCache();
  await clearExpenseCache();
  await clearTransferCache();
  await clearCategoryCache();
};
