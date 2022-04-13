import {
  ApiResponse,
  CreateIncomeDto,
  IncomeDto,
  UpdateIncomeDto,
} from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const getAllIncomes = async (): Promise<IncomeDto[]> => {
  const incomes = await fetch('/api/incomes');
  return incomes.json();
};

export const getIncomeById = async (id: string): Promise<IncomeDto> => {
  const income = await fetch(`/api/incomes/${id}`);
  return income.json();
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
