import { Metadata } from 'next';

import { TransactionListWithMonthlyPager } from '@/features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Transactions',
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryDate = (await searchParams).date as string | undefined;

  return (
    <>
      <ContentHeader title="Transactions" />
      <TransactionListWithMonthlyPager isSummaryVisible queryDate={queryDate} />
    </>
  );
}
