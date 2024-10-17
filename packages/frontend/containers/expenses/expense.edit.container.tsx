import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { ExpenseDto } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionDelete } from '$blocks/transaction-delete/transaction-delete';
import { TransactionForm } from '$blocks/transaction-form/transaction-form';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { ExpenseService } from '$ssr/api/expense.service ';
import { DateFormat, formatDate } from '$utils/formatDate';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface EditExpenseContainerProps {
  id: string;
}

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

    let data: ExpenseDto;

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

  const handleDelete = async () => {
    'use server';

    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await ExpenseService.delete(id);

    redirect('/statistics', RedirectType.push);
  };

  const initialValues = {
    ...expense,
    date: formatDate(new Date(expense.date), DateFormat.input),
  };

  return (
    <>
      <UpdatePageInfo
        backLink={`/statistics/expenses/${expense?.id}`}
        headerAction={<TransactionDelete onDelete={handleDelete} />}
      />
      {expense && (
        <TransactionForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          hasFromAccountField
        />
      )}
    </>
  );
};
