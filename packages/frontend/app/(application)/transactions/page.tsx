import { Metadata } from 'next';

import { TransactionListWithMonthlyPager } from '$features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '$features/transactions/TransactionsLayout';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const queryDate = (await searchParams).date as string | undefined;

  return (
    <TransactionsLayout title="Transactions">
      <TransactionListWithMonthlyPager isSummaryVisible queryDate={queryDate} />
    </TransactionsLayout>
  );
}
