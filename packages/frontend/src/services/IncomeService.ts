import { ApiResponseWithStatus, IIncome } from '@local/types';

export const getAllIncomes = async (): Promise<IIncome[]> => {
  const incomes = await fetch('/api/incomes');
  return incomes.json();
};

export const getIncomeById = async (id: string): Promise<IIncome> => {
  const income = await fetch(`/api/incomes/${id}`);
  return income.json();
};

export const addIncome = async (
  newIncomeData: IIncome
): Promise<ApiResponseWithStatus<IIncome>> => {
  const newIncome = await fetch('/api/incomes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newIncomeData),
  });

  return { payload: await newIncome.json(), status: newIncome.status };
};

export const updateIncome = async (
  targetIncome: IIncome,
  id: string
): Promise<ApiResponseWithStatus<IIncome>> => {
  const updatedIncome = await fetch(`/api/incomes/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetIncome),
  });

  return { payload: await updatedIncome.json(), status: updatedIncome.status };
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
