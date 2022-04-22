import {
  ApiResponse,
  CreateExpenseDto,
  ExpenseDto,
  PaginationDto,
  TransactionMonthSummaryDto,
  UpdateExpenseDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

import {
  parseFilterQueryString,
  TransactionFilterOptions,
} from './TransactionService';

export const getAllExpenses = async (
  options: TransactionFilterOptions = {}
): Promise<PaginationDto<ExpenseDto[]>> => {
  const queryString = parseFilterQueryString(options);

  const expenses = await fetch(`/api/expenses?${queryString.join('&')}`);
  return parseJsonOrThrowError(expenses);
};

export const getAllExpensesPaged = async ({
  pageParam = 1,
}: {
  pageParam?: number;
}): Promise<PaginationDto<ExpenseDto[]>> => {
  const expenses = await fetch(`/api/expenses?page=${pageParam}&year=2022`);
  return parseJsonOrThrowError(expenses);
};

export const getExpenseById = async (id: string): Promise<ExpenseDto> => {
  const expense = await fetch(`/api/expenses/${id}`);
  return parseJsonOrThrowError(expense);
};

export const getExpenseMonthlySummaries = async (): Promise<
  TransactionMonthSummaryDto[]
> => {
  const expense = await fetch(`/api/expenses/monthly-summaries`);
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
