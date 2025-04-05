'use server';

import { RedirectType, redirect } from 'next/navigation';

import {
  SchemaExpenseDetailsDto,
  SchemaIncomeDetailsDto,
  SchemaTransferDetailsDto,
  TransactionType,
} from '@/api/ssr-financer-api';
import { addExpense, addIncome, addTransfer } from '@/api-service';
import { ValidationException } from '@/exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '@/features/transaction/TransactionCategories/transaction-categories.types';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

export const handleTransactionCreate: DefaultFormActionHandler = async (
  prevState,
  formData,
) => {
  const categories = parseArrayFromFormData(
    formData,
    'categories',
    isCategoriesFormFullFields,
    parseCategoriesFormFullFields,
  ).map((item) => ({ ...item, description: item.description ?? null }));

  const isIncome =
    Boolean(formData.get('toAccount')) && !formData.get('fromAccount');
  const isExpense =
    !formData.get('toAccount') && Boolean(formData.get('fromAccount'));

  const type = isIncome
    ? TransactionType.INCOME
    : isExpense
      ? TransactionType.EXPENSE
      : TransactionType.TRANSFER;

  const TransactionDataMapping = {
    [TransactionType.INCOME]: {
      operation: addIncome,
    },
    [TransactionType.EXPENSE]: {
      operation: addExpense,
    },
    [TransactionType.TRANSFER]: {
      operation: addTransfer,
    },
  };

  let data:
    | SchemaIncomeDetailsDto
    | SchemaExpenseDetailsDto
    | SchemaTransferDetailsDto;

  try {
    data = await TransactionDataMapping[type].operation({
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      toAccount: formData.get('toAccount') as string,
      fromAccount: formData.get('fromAccount') as string,
      categories,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return { status: 'ERROR', errors: error.errors };
    }

    console.error(error);
    return { status: 'ERROR', errors: ['Something went wrong'] };
  }

  redirect(`/transactions/${data.id}`, RedirectType.push);
};
