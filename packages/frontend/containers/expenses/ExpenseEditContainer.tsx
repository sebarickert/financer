import { RedirectType, notFound, redirect } from 'next/navigation';
import { FC } from 'react';

import {
  SchemaExpenseDetailsDto,
  VisibilityType,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '@/features/transaction/TransactionCategories/transaction-categories.types';
import { TransactionForm } from '@/features/transaction/TransactionForm';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { Layout } from '@/layouts/Layout';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { AccountService } from '@/ssr/api/AccountService';
import { CategoryService } from '@/ssr/api/CategoryService';
import { ExpenseService } from '@/ssr/api/ExpenseService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

interface EditExpenseContainerProps {
  id: string;
}

export const EditExpenseContainer: FC<EditExpenseContainerProps> = async ({
  id,
}) => {
  const expense = await ExpenseService.getById(id);
  const accounts = await AccountService.getAll();

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
    ).map((item) => ({ ...item, description: item.description ?? null }));

    let data: SchemaExpenseDetailsDto;

    try {
      data = await ExpenseService.update(expense.id, {
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
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

    redirect(`/transactions/expenses/${data.id}`, RedirectType.push);
  };

  const initialValues = {
    ...expense,
    fromAccount: expense.fromAccount ?? undefined,
    categories: expense.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId,
        amount,
        description: description ?? undefined,
      }),
    ),
    date: new DateService(expense.date).format(DATE_FORMAT.INPUT),
  };

  const categories = await CategoryService.getAllWithTree({
    visibilityType: VisibilityType.EXPENSE,
  });

  return (
    <Layout title="Edit Expense" backLink={`/transactions/expenses/${id}`}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasFromAccountField
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </Layout>
  );
};
