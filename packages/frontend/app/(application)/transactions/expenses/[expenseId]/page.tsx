import { Pencil, Trash } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TransactionType } from '@/api/ssr-financer-api';
import { Popper } from '@/elements/Popper';
import { TransactionDeleteDrawer } from '@/features/transaction/TransactionDeleteDrawer';
import { ContentHeader } from '@/layouts/ContentHeader';
import { ExpenseService } from '@/ssr/api/ExpenseService';
import { Transaction } from '@/views/Transaction';

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
    title: expense.description,
  };
};

export default async function ExpensePage({ params }: { params: Params }) {
  const { expenseId } = await params;

  const expense = await ExpenseService.getById(expenseId);

  if (!expense) {
    notFound();
  }

  return (
    <>
      <ContentHeader
        title="Expense Details"
        backLink="/transactions"
        headerAction={
          <Popper
            items={[
              {
                href: `/transactions/${expense.type.toLowerCase()}s/${expenseId}/edit`,
                Icon: Pencil,
                label: 'Edit',
              },
              {
                Icon: Trash,
                label: 'Delete',
                popperId: expense.id,
              },
            ]}
          />
        }
      />
      <Transaction {...expense} />
      <TransactionDeleteDrawer id={expense.id} type={TransactionType.EXPENSE} />
    </>
  );
}
