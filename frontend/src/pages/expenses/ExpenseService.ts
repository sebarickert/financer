export const getAllExpenses = async (): Promise<IExpense[]> => {
  const expenses = await fetch("/api/expense");
  return expenses.json();
};

export const getExpenseById = async (id: string): Promise<IExpense> => {
  const expense = await fetch(`/api/expense/${id}`);
  return (await expense.json()).payload;
};

export const addExpense = async (
  newExpenseData: IExpense
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const newExpense = await fetch("/api/expense", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newExpenseData),
  });

  return newExpense.json();
};

export const deleteExpense = async (id: string): Promise<void> => {
  await fetch(`/api/expense/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
