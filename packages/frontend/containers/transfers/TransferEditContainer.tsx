import { RedirectType, notFound, redirect } from 'next/navigation';
import { FC } from 'react';

import {
  SchemaTransferDetailsDto,
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
import { TransferService } from '@/ssr/api/TransferService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

interface TransferEditContainerProps {
  id: string;
}

export const TransferEditContainer: FC<TransferEditContainerProps> = async ({
  id,
}) => {
  const transfer = await TransferService.getById(id);
  const accounts = await AccountService.getAll();

  if (!transfer) {
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

    let data: SchemaTransferDetailsDto;

    try {
      data = await TransferService.update(transfer.id, {
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

    redirect(`/transactions/transfers/${data.id}`, RedirectType.push);
  };

  const initialValues = {
    ...transfer,
    toAccount: transfer.toAccount ?? undefined,
    fromAccount: transfer.fromAccount ?? undefined,
    categories: transfer.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId,
        amount,
        description: description ?? undefined,
      }),
    ),
    date: new DateService(transfer.date).format(DATE_FORMAT.INPUT),
  };

  const categories = await CategoryService.getAllWithTree({
    visibilityType: VisibilityType.TRANSFER,
  });

  return (
    <Layout title="Edit Transfer" backLink={`/transactions/transfers/${id}`}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        hasFromAccountField
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </Layout>
  );
};
