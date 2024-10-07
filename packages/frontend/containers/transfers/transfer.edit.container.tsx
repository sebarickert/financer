import { notFound, redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { TransferDto } from '$api/generated/financerApi';
import {
  isCategoriesFormFullFields,
  parseCategoriesFormFullFields,
} from '$blocks/transaction-categories/transaction-categories.types';
import { TransactionDelete } from '$blocks/transaction-delete/transaction-delete';
import { TransactionForm } from '$blocks/transaction-form/transaction-form';
import { ValidationException } from '$exceptions/validation.exception';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { TransferService } from '$ssr/api/transfer.service';
import { DateFormat, formatDate } from '$utils/formatDate';
import { parseArrayFromFormData } from '$utils/parseArrayFromFormData';

interface TransferEditContainerProps {
  id: string;
}

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

    let data: TransferDto;

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

  const handleDelete = async () => {
    'use server';

    if (!id) {
      console.error('Failed to delete transfer: no id');
      return;
    }
    await TransferService.delete(id);

    redirect('/statistics', RedirectType.push);
  };

  const initialValues = {
    ...transfer,
    date: formatDate(new Date(transfer.date), DateFormat.input),
  };

  return (
    <>
      <UpdatePageInfo
        backLink={`/statistics/transfer/${transfer?.id}`}
        headerAction={<TransactionDelete onDelete={handleDelete} />}
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        hasFromAccountField
      />
    </>
  );
};
