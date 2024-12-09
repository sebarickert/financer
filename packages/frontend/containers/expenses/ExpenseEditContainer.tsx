import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { ExpenseDetailsDto } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$features/transaction/TransactionCategories/transaction-categories.types';
import { TransactionForm } from '$features/transaction/TransactionForm';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Layout } from '$layouts/Layout';
import { ExpenseService } from '$ssr/api/ExpenseService';
import { DateFormat, formatDate } from '$utils/formatDate';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

type EditExpenseContainerProps = {
  id: string;
};

export const EditExpenseContainer: FC<EditExpenseContainerProps> = async ({
  id,
}) => {
  const expense = await ExpenseService.getById(id);

  if (!expense) {
    notFound();
  }

  const handleSubmit: DefaultFormActionHandler = async (
    prevState,
    formData,
  ) => {
    'use server';

    const categories = parseArrayFromFormData(
      formData,
      'categories',
      isCategoriesFormFullFields,
      parseCategoriesFormFullFields,
    );

    let data: ExpenseDetailsDto;

    try {
      data = await ExpenseService.update(expense.id, {
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
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

    redirect(`/statistics/expenses/${data.id}`, RedirectType.push);
  };

  const initialValues = {
    ...expense,
    categories: expense.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId: categoryId,
        amount,
        description,
      }),
    ),
    date: formatDate(new Date(expense.date), DateFormat.input),
  };

  return (
    <Layout title="Edit Expense" backLink={`/statistics/expenses/${id}`}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasFromAccountField
      />
    </Layout>
  );
};
