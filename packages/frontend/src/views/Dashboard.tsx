import { FC } from 'react';

import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
import { TransactionList } from '$features/transaction/TransactionList/TransactionList';

export const Dashboard: FC = () => {
  return (
    <section className="grid gap-8">
      <BalanceGraph />
      <DashboardStats />
      <section className="grid gap-4">
        <TransactionList filterOptions={{ limit: 8 }} hasStickyHeader />
        <Button
          href="/statistics"
          accentColor="secondary"
          className="lg:ml-auto"
        >
          <span>See all</span>
          <Icon name="ArrowRightIcon" />
        </Button>
      </section>
    </section>
  );
};
