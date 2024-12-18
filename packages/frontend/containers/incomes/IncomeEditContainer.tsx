import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { IncomeDetailsDto, VisibilityType } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$features/transaction/TransactionCategories/transaction-categories.types';
import { TransactionForm } from '$features/transaction/TransactionForm';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Layout } from '$layouts/Layout';
import { DATE_FORMAT, DateService } from '$services/DateService';
import { CategoryService } from '$ssr/api/CategoryService';
import { IncomeService } from '$ssr/api/IncomeService';
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

    redirect(`/transactions/incomes/${data.id}`, RedirectType.push);
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
    date: new DateService(income.date).format(DATE_FORMAT.INPUT),
  };

  const categories = await CategoryService.getAllWithTree({
    visibilityType: VisibilityType.Income,
  });

  return (
    <Layout title="Edit Income" backLink={`/transactions/incomes/${id}`}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        transactionCategoriesWithCategoryTree={categories}
      />
    </Layout>
  );
};
