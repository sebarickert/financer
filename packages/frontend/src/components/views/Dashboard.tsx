import { FC } from 'react';

import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { TransactionList } from '$blocks/TransactionList/TransactionList';
import { Heading } from '$elements/Heading';

export const Dashboard: FC = () => {
  return (
    <section className="grid gap-8">
      <DashboardStats />
      <BalanceGraph />
      <section>
        <Heading cta={{ label: 'See All', url: '/statistics' }}>
          Recent Activity
        </Heading>
        <TransactionList isPagerHidden filterOptions={{ limit: 8 }} />
      </section>
    </section>
  );
};
