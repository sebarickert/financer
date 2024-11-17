import { FC } from 'react';

import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { TransactionList } from '$features/transaction/TransactionList/TransactionList';
import { TransactionService } from '$ssr/api/transaction.service';

export const Dashboard: FC = async () => {
  const transactions = await TransactionService.getAllByType(null);

  return (
    <section className="grid gap-8">
      <BalanceGraph />
      <DashboardStats />
      <section className="grid gap-4">
        <TransactionList filterOptions={{ limit: 8 }} hasStickyHeader />
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
