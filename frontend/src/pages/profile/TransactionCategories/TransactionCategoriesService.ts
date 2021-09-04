export const getAllTransactionCategories = async (): Promise<
  ITransactionCategory[]
> => {
  const transactionCategories = await fetch("/api/transaction-categories");
  return transactionCategories.json();
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
