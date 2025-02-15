import { Metadata } from 'next';

import { TransactionType } from '$api/generated/financerApi';
import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const metadata: Metadata = {
  title: 'Incomes',
};

export default async function IncomesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryDate = (await searchParams).date as string | undefined;

  return (
    <TransactionsLayout title="Incomes">
      <TransactionListWithMonthlyPager
        type={TransactionType.Income}
        queryDate={queryDate}
      />
    </TransactionsLayout>
  );
}
