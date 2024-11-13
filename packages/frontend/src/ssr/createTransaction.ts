'use server';

import { redirect, RedirectType } from 'next/navigation';

import { ExpenseService } from './api/expense.service ';
import { IncomeService } from './api/income.service';
import { TransferService } from './api/transfer.service';

import {
  ExpenseDetailsDto,
  IncomeDetailsDto,
  TransactionType,
  TransferDetailsDto,
} from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$features/transaction/TransactionCategories/transaction-categories.types';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

export const createTransaction: DefaultFormActionHandler = async (
  prevState,
  formData,
) => {
  const categories = parseArrayFromFormData(
    formData,
    'categories',
    isCategoriesFormFullFields,
    parseCategoriesFormFullFields,
  );

  const isIncome =
    Boolean(formData.get('toAccount')) && !Boolean(formData.get('fromAccount'));
  const isExpense =
    !Boolean(formData.get('toAccount')) && Boolean(formData.get('fromAccount'));

  const type = isIncome
    ? TransactionType.Income
    : isExpense
      ? TransactionType.Expense
      : TransactionType.Transfer;

  const TransactionDataMapping = {
    [TransactionType.Income]: {
      service: IncomeService,
      url: '/statistics/incomes',
    },
    [TransactionType.Expense]: {
      service: ExpenseService,
      url: '/statistics/expenses',
    },
    [TransactionType.Transfer]: {
      service: TransferService,
      url: '/statistics/transfers',
    },
  };

  let data: IncomeDetailsDto | ExpenseDetailsDto | TransferDetailsDto;

  try {
    data = await TransactionDataMapping[type].service.add({
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      toAccount: formData.get('toAccount') as string,
      fromAccount: formData.get('fromAccount') as string,
      categories: categories,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return { status: 'ERROR', errors: error.errors };
    }

    console.error(error);
    return { status: 'ERROR', errors: ['Something went wrong'] };
  }

  redirect(`${TransactionDataMapping[type].url}/${data.id}`, RedirectType.push);
};
