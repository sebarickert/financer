import { BalanceGraph } from '../../components/balance-graph/balance-graph';
import { CtaBlock } from '../../components/cta-block/cta-block';
import { CtaBlockItem } from '../../components/cta-block/cta-block.item';
import { DashboardLatestTransactions } from '../../components/dashboard-latest-transactions/dashboard-latest-transactions';
import { DashboardStats } from '../../components/dashboard-stats/dashboard.stats';
import { Heading } from '../../components/heading/heading';
import { QuickLinks } from '../../components/quick-links/quick-links';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { SEO } from '../../components/seo/seo';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <SEO title="Dashboard" />
      <Heading variant="h1" className="mb-4 lg:mb-6">
        Dashboard
      </Heading>
      <section className="grid">
        <section className="grid md:grid-cols-[40%,1fr] gap-4 md:auto-rows-[fit-content(0)]">
          <section className="grid gap-4 md:self-baseline">
            <DashboardStats />
            <CtaBlock label="Quick transaction links">
              <CtaBlockItem
                label="Income"
                iconName="download"
                link="/statistics/incomes/add"
                ariaLabel="Add new income transaction"
              />
              <CtaBlockItem
                label="Expense"
                iconName="upload"
                link="/statistics/expenses/add"
                ariaLabel="Add new expense transaction"
              />
              <CtaBlockItem
                label="Transfer"
                iconName="switch-horizontal"
                link="/statistics/transfers/add"
                ariaLabel="Add new transfer transaction"
              />
            </CtaBlock>
          </section>
          <BalanceGraph />
        </section>
        <section className="mt-8 mb-4">
          <Heading className="mb-4">Recent transactions</Heading>
          <div className="overflow-y-auto">
            <DashboardLatestTransactions />
          </div>
        </section>
        <QuickLinks>
          <QuickLinksItem
            title="Incomes"
            link="/statistics/incomes"
            iconName="download"
            iconBackgroundColor="green"
            description="Go to incomes page where you are able to manage your income transactions."
          />
          <QuickLinksItem
            title="Expenses"
            link="/statistics/expenses"
            iconName="upload"
            iconBackgroundColor="red"
            description="Go to expenses page where you are able to manage your expense transactions."
          />
          <QuickLinksItem
            title="Transfers"
            link="/statistics/transfers"
            iconName="switch-horizontal"
            description="Go to transfers page where you are able to manage your transfer transactions."
          />
        </QuickLinks>
      </section>
    </>
  );
};
