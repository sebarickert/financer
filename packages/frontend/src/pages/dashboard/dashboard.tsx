import { BalanceGraph } from '../../components/blocks/balance-graph/balance-graph';
import { DashboardStats } from '../../components/blocks/dashboard-stats/dashboard.stats';
import { Heading } from '../../components/elements/heading/heading';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';

import { TransactionListingContainer } from '$blocks/transaction-listing/transaction-listing.container';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Dashboard" />
      <section className="grid gap-6 md:gap-8">
        <DashboardStats />
        <BalanceGraph />
        <section>
          <Heading className="mb-4" ctaLabel="See all" ctaUrl="/statistics">
            Recent activity
          </Heading>
          <TransactionListingContainer
            isPagerHidden
            filterOptions={{ limit: 8 }}
          />
        </section>
      </section>
    </>
  );
};
