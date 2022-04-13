import { ApiResponse, TransactionCategoryMappingDto } from '@local/types';

import { parseApiResponse } from '../utils/apiHelper';

export const addTransactionCategoryMapping = async (
  newTransactionCategoryMappingData: TransactionCategoryMappingDto[]
): Promise<ApiResponse<TransactionCategoryMappingDto[]>> => {
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

  return parseApiResponse(newTransactionCategoryMapping);
};

export const getTransactionCategoryMappingByTransactionId = async (
  id: string
): Promise<TransactionCategoryMappingDto[]> => {
  const transactionCategoryMapping = await fetch(
    `/api/transaction-category-mappings/by-transaction/${id}`
  );
  return transactionCategoryMapping.json();
};

export const getAllTransactionCategoryMappings = async (): Promise<
  TransactionCategoryMappingDto[]
> => (await fetch('/api/transaction-category-mappings')).json();
