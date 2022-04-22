import {
  ApiResponse,
  CreateIncomeDto,
  IncomeDto,
  PaginationDto,
  TransactionMonthSummaryDto,
  UpdateIncomeDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

import {
  TransactionFilterOptions,
  parseFilterQueryString,
} from './TransactionService';

export const getAllIncomes = async (
  options: TransactionFilterOptions = {}
): Promise<PaginationDto<IncomeDto[]>> => {
  const queryString = parseFilterQueryString(options);

  const incomes = await fetch(`/api/incomes?${queryString.join('&')}`);
  return parseJsonOrThrowError(incomes);
};

export const getIncomeById = async (id: string): Promise<IncomeDto> => {
  const income = await fetch(`/api/incomes/${id}`);
  return parseJsonOrThrowError(income);
};

export const getIncomeMonthlySummaries = async (): Promise<
  TransactionMonthSummaryDto[]
> => {
  const expense = await fetch(`/api/incomes/monthly-summaries`);
  return parseJsonOrThrowError(expense);
};

export const addIncome = async (
  newIncomeData: CreateIncomeDto
): Promise<ApiResponse<IncomeDto>> => {
  const newIncome = await fetch('/api/incomes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newIncomeData),
  });

  return parseApiResponse(newIncome);
};

export const updateIncome = async (
  targetIncome: UpdateIncomeDto,
  id: string
): Promise<ApiResponse<IncomeDto>> => {
  const updatedIncome = await fetch(`/api/incomes/${id}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetIncome),
  });

  return parseApiResponse(updatedIncome);
};

export const deleteIncome = async (id: string): Promise<void> => {
  await fetch(`/api/incomes/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
