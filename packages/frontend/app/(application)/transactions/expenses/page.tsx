import { Metadata } from 'next';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryDate = (await searchParams).date as string | undefined;

  return (
    <TransactionsLayout title="Expenses">
      <TransactionListWithMonthlyPager
        type={TransactionType.Expense}
        queryDate={queryDate}
      />
    </TransactionsLayout>
  );
}
