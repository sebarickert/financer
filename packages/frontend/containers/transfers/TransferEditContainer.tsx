import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { TransferDetailsDto } from '$api/generated/financerApi';
import { ValidationException } from '$exceptions/validation.exception';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$features/transaction/transaction-categories/transaction-categories.types';
import { TransactionForm } from '$features/transaction/TransactionForm';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { Layout } from '$layouts/Layout';
import { TransferService } from '$ssr/api/transfer.service';
import { DateFormat, formatDate } from '$utils/formatDate';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

type TransferEditContainerProps = {
  id: string;
};

export const TransferEditContainer: FC<TransferEditContainerProps> = async ({
  id,
}) => {
  const transfer = await TransferService.getById(id);

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
    );

    let data: TransferDetailsDto;

    try {
      data = await TransferService.update(transfer.id, {
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

    redirect(`/statistics/transfers/${data.id}`, RedirectType.push);
  };

  const initialValues = {
    ...transfer,
    categories: transfer.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId: categoryId,
        amount,
        description,
      }),
    ),
    date: formatDate(new Date(transfer.date), DateFormat.input),
  };

  return (
    <Layout title="Edit Transfer" backLink={`/statistics/transfers/${id}`}>
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        hasFromAccountField
      />
    </Layout>
  );
};
