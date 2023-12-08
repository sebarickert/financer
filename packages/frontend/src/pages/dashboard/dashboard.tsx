import { BalanceGraph } from '../../components/blocks/balance-graph/balance-graph';
import { DashboardStats } from '../../components/blocks/dashboard-stats/dashboard.stats';
import { LatestTransactions } from '../../components/blocks/latest-transactions/latest-transactions';
import { Heading } from '../../components/elements/heading/heading';
import { UpdatePageInfo } from '../../components/renderers/seo/updatePageInfo';

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
          <LatestTransactions isPagerHidden filterOptions={{ limit: 8 }} />
        </section>
      </section>
    </>
  );
};
