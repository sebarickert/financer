import { BalanceGraph } from '$blocks/balance-graph/balance-graph';
import { DashboardStats } from '$blocks/dashboard-stats/dashboard.stats';
import { TransactionListingContainer } from '$blocks/transaction-listing/transaction-listing.container';
import { Heading } from '$elements/Heading';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo />
      <section className="grid gap-6 md:gap-8">
        <section>
          <DashboardStats />
          <BalanceGraph />
        </section>
        <section>
          <Heading cta={{ label: 'See All', url: '/statistics' }}>
            Recent Activity
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
