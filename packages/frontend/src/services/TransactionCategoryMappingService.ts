import { IApiResponse, ITransactionCategoryMapping } from '@local/types';

export const addTransactionCategoryMapping = async (
  newTransactionCategoryMappingData: ITransactionCategoryMapping[]
): Promise<IApiResponse<ITransactionCategoryMapping[]>> => {
  const newTransactionCategoryMapping = await fetch(
    '/api/transaction-categories-mapping',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransactionCategoryMappingData),
    }
  );

  return newTransactionCategoryMapping.json();
};

export const getTransactionCategoryMappingByTransactionId = async (
  id: string
): Promise<ITransactionCategoryMapping[]> => {
  const transactionCategoryMapping = await fetch(
    `/api/transaction-categories-mapping/by-transaction/${id}`
  );
  return (await transactionCategoryMapping.json()).payload;
};

export const getAllTransactionCategoryMappings = async (): Promise<
  ITransactionCategoryMapping[]
> => (await fetch('/api/transaction-categories-mapping')).json();
