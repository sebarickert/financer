import {
  ApiResponseWithStatus,
  ITransactionCategoryMapping,
} from '@local/types';

export const addTransactionCategoryMapping = async (
  newTransactionCategoryMappingData: ITransactionCategoryMapping[]
): Promise<ApiResponseWithStatus<ITransactionCategoryMapping[]>> => {
  const newTransactionCategoryMapping = await fetch(
    '/api/transaction-category-mappings',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransactionCategoryMappingData),
    }
  );

  return {
    payload: await newTransactionCategoryMapping.json(),
    status: newTransactionCategoryMapping.status,
  };
};

export const getTransactionCategoryMappingByTransactionId = async (
  id: string
): Promise<ITransactionCategoryMapping[]> => {
  const transactionCategoryMapping = await fetch(
    `/api/transaction-category-mappings/by-transaction/${id}`
  );
  return transactionCategoryMapping.json();
};

export const getAllTransactionCategoryMappings = async (): Promise<
  ITransactionCategoryMapping[]
> => (await fetch('/api/transaction-category-mappings')).json();
