import {
  ApiResponse,
  CreateTransactionTemplateDto,
  TransactionTemplateDto,
  UpdateTransactionTemplateDto,
} from '@local/types';

import { parseApiResponse, parseJsonOrThrowError } from '../utils/apiHelper';

export const getAllTransactionTemplates = async (): Promise<
  TransactionTemplateDto[]
> => {
  const transactionTemplates = await fetch('/api/transaction-templates');
  return parseJsonOrThrowError(transactionTemplates);
};

export const getAllManualTransactionTemplates = async (): Promise<
  TransactionTemplateDto[]
> => {
  const transactionTemplates = await fetch('/api/transaction-templates/manual');
  return parseJsonOrThrowError(transactionTemplates);
};

export const addTransactionTemplate = async (
  newTransactionTemplateData: CreateTransactionTemplateDto
): Promise<ApiResponse<TransactionTemplateDto>> => {
  const newTransactionTemplate = await fetch('/api/transaction-templates', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransactionTemplateData),
  });

  return parseApiResponse(newTransactionTemplate);
};

export const getTransactionTemplateById = async (
  id: string
): Promise<TransactionTemplateDto> => {
  const transactionTemplate = await fetch(`/api/transaction-templates/${id}`);
  return parseJsonOrThrowError(transactionTemplate);
};

export const editTransactionTemplate = async (
  id: string,
  targetTransactionTemplateData: UpdateTransactionTemplateDto
): Promise<ApiResponse<TransactionTemplateDto>> => {
  const targetTransactionTemplate = await fetch(
    `/api/transaction-templates/${id}`,
    {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(targetTransactionTemplateData),
    }
  );

  return parseApiResponse(targetTransactionTemplate);
};

export const deleteTransactionTemplate = async (id: string): Promise<void> => {
  await fetch(`/api/transaction-templates/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
