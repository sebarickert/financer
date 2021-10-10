export const getAllIncomes = async (): Promise<IIncome[]> => {
  const incomes = await fetch('/api/income');
  return incomes.json();
};

export const getIncomeById = async (id: string): Promise<IIncome> => {
  const income = await fetch(`/api/income/${id}`);
  return (await income.json()).payload;
};

export const addIncome = async (
  newIncomeData: IIncome
): Promise<IApiResponse<IIncome>> => {
  const newIncome = await fetch('/api/income', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newIncomeData),
  });

  return newIncome.json();
};

export const updateIncome = async (
  targetIncome: IIncome,
  id: string
): Promise<IApiResponse<IIncome>> => {
  const updatedIncome = await fetch(`/api/income/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetIncome),
  });

  return updatedIncome.json();
};

export const deleteIncome = async (id: string): Promise<void> => {
  await fetch(`/api/income/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
