import { FC } from 'react';

import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { DashboardBalanceHistory } from '$features/dashboard/DashboardBalanceHistory';
import { TransactionList } from '$features/transaction/TransactionList/TransactionList';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const Dashboard: FC = async () => {
  const listChunkSizeSettings =
    await UserPreferenceService.getTransactionListChunkSize();

  const transactions = await TransactionService.getAllByType(null, {
    limit: listChunkSizeSettings ?? 5,
  });

  return (
    <section className="grid gap-8">
      <DashboardBalanceHistory />
      <section className="grid gap-4">
        <TransactionList label="Recent Activity" items={transactions} />
        {!!transactions.length && (
          <Button
            href="/statistics"
            accentColor="secondary"
            className="lg:ml-auto"
          >
            <span>See all</span>
            <Icon name="ArrowRightIcon" />
          </Button>
        )}
      </section>
    </section>
  );
};
