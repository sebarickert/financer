import {
  getAllCategories,
  getAllExpenses,
  getAllIncomes,
  getAllTransfers,
} from './api-helper';

import {
  ExpenseListItemDto,
  IncomeListItemDto,
  TransactionCategoryDto,
  TransferListItemDto,
} from '$types/generated/financer';

export const getExpenseIdWithSingleCategory =
  async (): Promise<ExpenseListItemDto> => {
    const expenses = await getAllExpenses();
    const expense = expenses.find(
      ({ description }) => description === 'Expense with category',
    );

    if (!expense) {
      throw new Error('Expense with single category not found');
    }

    return expense;
  };

export const getExpenseIdWithMultipleCategories =
  async (): Promise<ExpenseListItemDto> => {
    const expenses = await getAllExpenses();
    const expense = expenses.find(
      ({ description }) => description === 'Expense with multiple categories',
    );

    if (!expense) {
      throw new Error('Expense with multiple categories not found');
    }

    return expense;
  };

export const getIncomeIdWithSingleCategory =
  async (): Promise<IncomeListItemDto> => {
    const incomes = await getAllIncomes();
    const income = incomes.find(
      ({ description }) => description === 'Income with category',
    );

    if (!income) {
      throw new Error('Income with single category not found');
    }

    return income;
  };

export const getIncomeIdWithMultipleCategories =
  async (): Promise<IncomeListItemDto> => {
    const incomes = await getAllIncomes();
    const income = incomes.find(
      ({ description }) => description === 'Income with multiple categories',
    );

    if (!income) {
      throw new Error('Income with multiple categories not found');
    }

    return income;
  };

export const getTransferIdWithSingleCategory =
  async (): Promise<TransferListItemDto> => {
    const transfers = await getAllTransfers();
    const transfer = transfers.find(
      ({ description }) => description === 'Transfer with category',
    );

    if (!transfer) {
      throw new Error('Transfer with single category not found');
    }

    return transfer;
  };

export const getTransferIdWithMultipleCategories =
  async (): Promise<TransferListItemDto> => {
    const transfers = await getAllTransfers();
    const transfer = transfers.find(
      ({ description }) => description === 'Transfer with multiple categories',
    );

    if (!transfer) {
      throw new Error('Transfer with multiple categories not found');
    }

    return transfer;
  };

export const getCategoryForAllTypes =
  async (): Promise<TransactionCategoryDto> => {
    const categories = await getAllCategories();
    const category = categories.find(
      ({ name }) => name === 'Category for all types',
    );

    if (!category) {
      throw new Error('Category for all types not found');
    }

    return category;
  };

export const getCategoryForAllTypesChildCategory =
  async (): Promise<TransactionCategoryDto> => {
    const categories = await getAllCategories();
    const category = categories.find(
      ({ name }) => name === 'Invisible sub category',
    );

    if (!category) {
      throw new Error('Invisible sub category not found');
    }

    return category;
  };
