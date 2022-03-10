export const getAllExpenses = async (): Promise<IExpense[]> => {
  const expenses = await fetch('/api/expense');
  return expenses.json();
};

export const getExpenseById = async (id: string): Promise<IExpense> => {
  const expense = await fetch(`/api/expense/${id}`);
  return (await expense.json()).payload;
};

export const addExpense = async (
  newExpenseData: IExpense
): Promise<IApiResponse<IExpense>> => {
  const newExpense = await fetch('/api/expense', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newExpenseData),
  });

  return newExpense.json();
};

export const updateExpense = async (
  targetExpense: IExpense,
  id: string
): Promise<IApiResponse<IExpense>> => {
  const updatedExpense = await fetch(`/api/expense/${id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(targetExpense),
  });

  return updatedExpense.json();
};

export const deleteExpense = async (id: string): Promise<void> => {
  await fetch(`/api/expense/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
