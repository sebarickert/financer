import { Metadata } from 'next';
import { RedirectType, notFound, redirect } from 'next/navigation';

import { SchemaIncomeDetailsDto, VisibilityType } from '@/api/ssr-financer-api';
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
import { IncomeService } from '@/ssr/api/IncomeService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

type Params = Promise<{
  incomeId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { incomeId } = await params;
  const income = await IncomeService.getById(incomeId);

  return {
    title: `Edit ${income.description} / Incomes`,
  };
};

export default async function EditIncomePage({ params }: { params: Params }) {
  const { incomeId } = await params;

  const income = await IncomeService.getById(incomeId);

  if (!income) {
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

    let data: SchemaIncomeDetailsDto;

    try {
      data = await IncomeService.update(income.id, {
        amount: parseFloat(formData.get('amount') as string),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        toAccount: formData.get('toAccount') as string,
        categories,
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
    toAccount: income.toAccount ?? undefined,
    categories: income.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId,
        amount,
        description: description ?? undefined,
      }),
    ),
    date: new DateService(income.date).format(DATE_FORMAT.INPUT),
  };

  const categories = await CategoryService.getAllWithTree({
    visibilityType: VisibilityType.INCOME,
  });

  return (
    <>
      <ContentHeader
        title="Edit Income"
        backLink={`/transactions/incomes/${incomeId}`}
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
