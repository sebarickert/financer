import { Metadata } from 'next';

import { TransactionType } from '@/api/ssr-financer-api';
import { TransactionListWithMonthlyPager } from '@/features/transaction/TransactionListWithMonthlyPager/TransactionListWithMonthlyPager';
import { TransactionsLayout } from '@/features/transactions/TransactionsLayout';

export const metadata: Metadata = {
  title: 'Transfers',
};

export default async function TransfersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const queryDate = (await searchParams).date as string | undefined;

  return (
    <TransactionsLayout title="Transfers">
      <TransactionListWithMonthlyPager
        type={TransactionType.TRANSFER}
        queryDate={queryDate}
      />
    </TransactionsLayout>
  );
}
