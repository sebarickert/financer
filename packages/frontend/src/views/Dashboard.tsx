import clsx from 'clsx';
import { FC } from 'react';

import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { TransactionList } from '$features/transaction/TransactionList/TransactionList';

export const Dashboard: FC = () => {
  return (
    <section className="grid gap-8">
      <DashboardStats />
      <BalanceGraph />
      <section className="grid gap-4">
        <TransactionList filterOptions={{ limit: 8 }} hasStickyHeader />
        <Link
          href="/statistics"
          className={clsx(
            'py-3 pl-6 pr-4 text-base theme-button-secondary',
            'theme-focus ring-offset-2 dark:ring-offset-0 rounded-md inline-flex items-center gap-2 w-fit ml-auto',
          )}
        >
          <span>See all</span>
          <Icon name="ArrowRightIcon" />
        </Link>
      </section>
    </section>
  );
};
