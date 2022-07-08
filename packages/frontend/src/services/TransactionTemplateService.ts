import {
  ApiResponse,
  CreateTransactionTemplateDto,
  TransactionTemplateDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

export const getAllTransactionTemplates = async (): Promise<
  TransactionTemplateDto[]
> => {
  const transactionTemplates = await fetch('/api/transaction-template');
  return parseJsonOrThrowError(transactionTemplates);
};

export const addTransactionTemplate = async (
  newTransactionTemplateData: CreateTransactionTemplateDto
): Promise<ApiResponse<TransactionTemplateDto>> => {
  const newTransactionTemplate = await fetch('/api/transaction-template', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransactionTemplateData),
  });

  return parseApiResponse(newTransactionTemplate);
};
