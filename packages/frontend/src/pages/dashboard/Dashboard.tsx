import { BalanceGraph } from '../../components/balance-graph/balance-graph';
import { DashboardStats } from '../../components/dashboard-stats/dashboard.stats';
import { Heading } from '../../components/heading/heading';
import { LatestTransactions } from '../../components/latest-transactions/latest-transactions';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Dashboard" />
      <section className="grid gap-6">
        <section className="grid md:gap-4 md:grid-cols-[40%,1fr]">
          <DashboardStats />
          <BalanceGraph />
        </section>
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
