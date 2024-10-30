import { FC } from 'react';

import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { Heading } from '$elements/Heading';
import { TransactionList } from '$modules/transaction/TransactionList/TransactionList';

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
