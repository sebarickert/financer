import { BalanceGraph } from '../../components/balance-graph/balance-graph';
import { CtaBlock } from '../../components/cta-block/cta-block';
import { CtaBlockItem } from '../../components/cta-block/cta-block.item';
import { DashboardStats } from '../../components/dashboard-stats/dashboard.stats';
import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LatestTransactions } from '../../components/latest-transactions/latest-transactions';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { Shortcut } from '../../components/shortcut/shortcut';
import { ShortcutList } from '../../components/shortcut/shortcut.list';

export const Dashboard = (): JSX.Element => {
  return (
    <>
      <UpdatePageInfo title="Dashboard" />
      <section className="grid">
        <section className="grid md:grid-cols-[40%,1fr] gap-4 md:auto-rows-[fit-content(0)]">
          <section className="grid gap-4 md:self-baseline">
            <DashboardStats />
            <CtaBlock label="Quick transaction links">
              <CtaBlockItem
                label="Income"
                iconName={IconName.download}
                link="/statistics/incomes/add"
                ariaLabel="Add new income transaction"
              />
              <CtaBlockItem
                label="Expense"
                iconName={IconName.upload}
                link="/statistics/expenses/add"
                ariaLabel="Add new expense transaction"
              />
              <CtaBlockItem
                label="Transfer"
                iconName={IconName.switchHorizontal}
                link="/statistics/transfers/add"
                ariaLabel="Add new transfer transaction"
              />
            </CtaBlock>
          </section>
          <BalanceGraph className="overflow-y-auto" />
        </section>
        <section className="mt-6 lg:mt-8">
          <Heading className="mb-2">Recent activity</Heading>
          <LatestTransactions isPagerHidden filterOptions={{ limit: 5 }} />
        </section>
        <section className="mt-6 lg:mt-8">
          <Heading className="mb-6">Shortcuts</Heading>
          <ShortcutList>
            <Shortcut link="/">Diesel</Shortcut>
            <Shortcut link="/">Asuntolaina lyhennys</Shortcut>
            <Shortcut link="/">Asuntolaina korko</Shortcut>
            <Shortcut link="/">Autolaina lyhennys</Shortcut>
            <Shortcut link="/">Autolaina korko</Shortcut>
          </ShortcutList>
        </section>
      </section>
    </>
  );
};
