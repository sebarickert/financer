import { Loader } from '@/elements/Loader';
import { TransactionsLayout } from '@/features/transactions/TransactionsLayout';

export default function Loading() {
  return (
    <TransactionsLayout title="Statistics" isLoading>
      <Loader />
    </TransactionsLayout>
  );
}
