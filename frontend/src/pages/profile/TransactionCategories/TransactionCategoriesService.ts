export const getAllTransactionCategories = async (): Promise<
  ITransactionCategory[]
> => {
  const transactionCategories = await fetch("/api/transaction-categories");
  return transactionCategories.json();
};

export const getTransactionCategoryById = async (
  id: string
): Promise<ITransactionCategory> => {
  const transactionCategory = await fetch(`/api/transaction-categories/${id}`);
  return (await transactionCategory.json()).payload;
};

export const addTransactionCategory = async (
  newTransactionCategoryData: ITransactionCategory
): Promise<IApiResponse<ITransactionCategory>> => {
  const newTransactionCategory = await fetch("/api/transaction-categories", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTransactionCategoryData),
  });

  return newTransactionCategory.json();
};

export const editTransactionCategory = async (
  id: string,
  targetTransactionCategoryData: ITransactionCategory
): Promise<IApiResponse<ITransactionCategory>> => {
  const targetTransactionCategory = await fetch(
    `/api/transaction-categories/${id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(targetTransactionCategoryData),
    }
  );

  return targetTransactionCategory.json();
};

export const deleteTransactionCategory = async (id: string): Promise<void> => {
  await fetch(`/api/transaction-categories/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
};
