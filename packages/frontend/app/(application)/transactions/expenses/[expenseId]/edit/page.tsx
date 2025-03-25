import { Metadata } from 'next';
import { RedirectType, notFound, redirect } from 'next/navigation';

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
import { ContentHeader } from '@/layouts/ContentHeader';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { AccountService } from '@/ssr/api/AccountService';
import { CategoryService } from '@/ssr/api/CategoryService';
import { ExpenseService } from '@/ssr/api/ExpenseService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

type Params = Promise<{
  expenseId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { expenseId } = await params;
  const expense = await ExpenseService.getById(expenseId);

  return {
    title: `Edit ${expense.description}`,
  };
};

export default async function EditExpensePage({ params }: { params: Params }) {
  const { expenseId } = await params;
  const expense = await ExpenseService.getById(expenseId);

  if (!expense) {
    notFound();
  }
  const accounts = await AccountService.getAll();

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
    <>
      <ContentHeader
        title="Edit Expense"
        backLink={`/transactions/expenses/${expenseId}`}
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasFromAccountField
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
