import { Metadata } from 'next';
import { RedirectType, notFound, redirect } from 'next/navigation';

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
import { ContentHeader } from '@/layouts/ContentHeader';
import { DATE_FORMAT, DateService } from '@/services/DateService';
import { AccountService } from '@/ssr/api/AccountService';
import { CategoryService } from '@/ssr/api/CategoryService';
import { TransferService } from '@/ssr/api/TransferService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

type Params = Promise<{
  transferId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { transferId } = await params;
  const transfer = await TransferService.getById(transferId);

  return {
    title: `Edit ${transfer.description}`,
  };
};

export default async function EditTransferPage({ params }: { params: Params }) {
  const { transferId } = await params;

  const transfer = await TransferService.getById(transferId);

  if (!transfer) {
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
    <>
      <ContentHeader
        title="Edit Transfer"
        backLink={`/transactions/transfers/${transferId}`}
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        hasToAccountField
        hasFromAccountField
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
