import {
  ApiResponse,
  CreateExpenseDto,
  ExpenseDto,
  UpdateExpenseDto,
} from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const getAllExpenses = async (): Promise<ExpenseDto[]> => {
  const expenses = await fetch('/api/expenses');
  return expenses.json();
};

export const getExpenseById = async (id: string): Promise<ExpenseDto> => {
  const expense = await fetch(`/api/expenses/${id}`);
  return expense.json();
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
