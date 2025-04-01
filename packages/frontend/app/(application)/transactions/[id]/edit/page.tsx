import { Metadata } from 'next';
import { RedirectType, notFound, redirect } from 'next/navigation';

import {
  SchemaExpenseDetailsDto,
  SchemaIncomeDetailsDto,
  SchemaTransferDetailsDto,
  TransactionType,
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
import { IncomeService } from '@/ssr/api/IncomeService';
import { TransactionService } from '@/ssr/api/TransactionService';
import { TransferService } from '@/ssr/api/TransferService';
import { parseArrayFromFormData } from '@/utils/parseArrayFromFormData';

type Params = Promise<{
  id: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { id } = await params;
  const transaction = await TransactionService.getById(id);

  return {
    title: `Edit ${transaction.description}`,
  };
};

const transactionTypeToVisibilityType: Record<TransactionType, VisibilityType> =
  {
    [TransactionType.INCOME]: VisibilityType.INCOME,
    [TransactionType.EXPENSE]: VisibilityType.EXPENSE,
    [TransactionType.TRANSFER]: VisibilityType.TRANSFER,
  };

const TransactionTypeMapping = {
  [TransactionType.INCOME]: {
    service: IncomeService,
    fields: {
      hasToAccountField: true,
    },
  },
  [TransactionType.EXPENSE]: {
    service: ExpenseService,
    fields: {
      hasFromAccountField: true,
    },
  },
  [TransactionType.TRANSFER]: {
    service: TransferService,
    fields: {
      hasToAccountField: true,
      hasFromAccountField: true,
    },
  },
};

export default async function EditTransactionPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const transaction = await TransactionService.getById(id);

  if (!transaction) {
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

    let data:
      | SchemaIncomeDetailsDto
      | SchemaExpenseDetailsDto
      | SchemaTransferDetailsDto;

    try {
      data = await TransactionTypeMapping[transaction.type].service.update(
        transaction.id,
        {
          amount: parseFloat(formData.get('amount') as string),
          description: formData.get('description') as string,
          date: formData.get('date') as string,
          toAccount: formData.get('toAccount') as string,
          fromAccount: formData.get('fromAccount') as string,
          categories,
        },
      );
    } catch (error) {
      if (error instanceof ValidationException) {
        return { status: 'ERROR', errors: error.errors };
      }

      console.error(error);
      return { status: 'ERROR', errors: ['Something went wrong'] };
    }

    redirect(`/transactions/${data.id}`, RedirectType.push);
  };

  const initialValues = {
    ...transaction,
    toAccount: transaction.toAccount ?? undefined,
    fromAccount: transaction.fromAccount ?? undefined,
    categories: transaction.categories.map(
      ({ id: categoryId, amount, description }) => ({
        categoryId,
        amount,
        description: description ?? undefined,
      }),
    ),
    date: new DateService(transaction.date).format(DATE_FORMAT.INPUT),
  };

  const categories = await CategoryService.getAllWithTree({
    visibilityType: transactionTypeToVisibilityType[transaction.type],
  });

  return (
    <>
      <ContentHeader
        title={`Edit ${transaction.description}`}
        breadcrumbOverrides={{
          [`/transactions/${id}`]: transaction.description,
        }}
      />
      <TransactionForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
        {...TransactionTypeMapping[transaction.type].fields}
      />
    </>
  );
}
