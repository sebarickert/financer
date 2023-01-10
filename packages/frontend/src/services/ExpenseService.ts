import {
  ApiResponse,
  CreateExpenseDto,
  ExpenseDto,
  TransactionMonthSummaryDto,
  UpdateExpenseDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

import {
  parseFilterQueryString,
  TransactionFilterOptions,
} from './TransactionService';

export const getExpenseMonthlySummaries = async (
  options: Omit<TransactionFilterOptions, 'page'> = {}
): Promise<TransactionMonthSummaryDto[]> => {
  const queryString = parseFilterQueryString(options);

  const expense = await fetch(
    `/api/expenses/monthly-summaries?${queryString.join('&')}`
  );
  return parseJsonOrThrowError(expense);
};

export const addExpense = async (
  newExpenseData: CreateExpenseDto
): Promise<ApiResponse<ExpenseDto>> => {
  const newExpense = await fetch('/api/expenses', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newExpenseData),
  });

  return parseApiResponse(newExpense);
};

export const updateExpense = async (
  targetExpense: UpdateExpenseDto,
  id: string
): Promise<ApiResponse<ExpenseDto>> => {
  const updatedExpense = await fetch(`/api/expenses/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetExpense),
  });

  return parseApiResponse(updatedExpense);
};

export const deleteExpense = async (id: string): Promise<void> => {
  await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
