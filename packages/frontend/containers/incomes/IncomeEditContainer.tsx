import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { IncomeDetailsDto } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionForm } from '$blocks/TransactionForm';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Layout } from '$layouts/Layout';
import { IncomeService } from '$ssr/api/income.service';
import { DateFormat, formatDate } from '$utils/formatDate';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface IncomeEditContainerProps {
  id: string;
}

export const IncomeEditContainer: FC<IncomeEditContainerProps> = async ({
  id,
}) => {
  const income = await IncomeService.getById(id);

  if (!income) {
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

    let data: IncomeDetailsDto;

    try {
      data = await IncomeService.update(income.id, {
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        toAccount: formData.get('toAccount') as string,
        categories: categories,
      });
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    redirect(`/statistics/incomes/${data.id}`, RedirectType.push);
  };

  const handleDelete = async () => {
    'use server';

    if (!id) {
      console.error('Failed to delete expense: no id');
      return;
    }
    await IncomeService.delete(id);

    redirect('/statistics', RedirectType.push);
  };

  const initialValues = {
    ...income,
    categories: income.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId: categoryId,
        amount,
        description,
      }),
    ),
    date: formatDate(new Date(income.date), DateFormat.input),
  };

  return (
    <Layout title="Edit Income" backLink={`/statistics/incomes/${id}`}>
      {/* <UpdatePageInfo
        backLink={`/statistics/incomes/${income?.id}`}
        headerAction={<TransactionDelete onDelete={handleDelete} />}
      /> */}
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        testId="edit-income-form"
      />
    </Layout>
  );
};