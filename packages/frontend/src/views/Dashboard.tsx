import { ArrowRight, ChartLine, Layers, Tag } from 'lucide-react';
import { FC } from 'react';

import {
  getAccountsTotalBalance,
  getAllTransactionsByType,
  getDashboardSettings,
  getLatestTransactionByType,
  getTransactionListChunkSize,
  getTransactionMonthlySummary,
} from '@/api-service';
import { Card } from '@/blocks/Card/Card';
import { CardHeader } from '@/blocks/Card/CardHeader';
import { InfoMessageBlock } from '@/blocks/InfoMessageBlock';
import { List } from '@/blocks/List';
import { ProminentLink } from '@/blocks/ProminentLink';
import { Heading } from '@/elements/Heading';
import { Link } from '@/elements/Link';
import { DashboardBalanceHistoryChart } from '@/features/dashboard/DashboardBalanceHistoryChart';
import { DashboardBalanceSummary } from '@/features/dashboard/DashboardBalanceSummary';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { TransactionList } from '@/features/transaction/TransactionList/TransactionList';
import { DateService } from '@/services/DateService';

const currentMonthFilterOptions = {
  year: new DateService().getDate().year,
  month: new DateService().getDate().month,
};

export const Dashboard: FC = async () => {
  const listChunkSizeSettings = await getTransactionListChunkSize();

  const transactions = await getAllTransactionsByType(null, {
    limit: listChunkSizeSettings ?? 5,
  });

  const dashboardSettings = await getDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const totalBalance = await getAccountsTotalBalance(accountTypeFilter);
  const latestTransaction = await getLatestTransactionByType();

  const transactionMonthSummary = await getTransactionMonthlySummary({
    ...accountTypeFilter,
  });

  const latestTransactionTimestamp = new DateService(
    latestTransaction?.date,
  ).getDate();

  const balanceHistory = transactionMonthSummary
    .map(({ id: { month, year }, totalAmount }) => ({
      date: DateService.createFromYearAndMonth(year, month),
      amount: totalAmount,
    }))
    .sort((a, b) => b.date.toMillis() - a.date.toMillis())
    .reduce(
      (previousBalance, { date, amount }) => {
        const { balance: latestBalance } = previousBalance[0];
        const currentBalance = {
          date: date.toJSDate(),
          balance: latestBalance - amount,
        };
        return [currentBalance, ...previousBalance];
      },
      [{ date: latestTransactionTimestamp.toJSDate(), balance: totalBalance }],
    );

  const previousMonthBalance =
    balanceHistory[balanceHistory.length - 2]?.balance;

  const { incomeAmount: totalIncomes = 0, expenseAmount: totalExpenses = 0 } =
    transactionMonthSummary.find(
      ({ id }) =>
        id.month === currentMonthFilterOptions.month &&
        id.year === currentMonthFilterOptions.year,
    ) ?? {};

  const navigationVtNames = generateNavigationViewTransitionName();

  return (
    <section className="grid gap-4">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
        <div className="grid gap-4 self-baseline">
          <DashboardBalanceSummary
            {...{
              totalBalance,
              totalExpenses,
              totalIncomes,
              previousMonthBalance,
            }}
          />
          <List>
            <ProminentLink
              link="/categories"
              Icon={Tag}
              vtName={navigationVtNames.categories}
            >
              Categories
            </ProminentLink>
            <ProminentLink
              link="/templates"
              Icon={Layers}
              vtName={navigationVtNames.templates}
            >
              Templates
            </ProminentLink>
          </List>
        </div>
        {balanceHistory.length < 3 && (
          <InfoMessageBlock title="Not Enough Data Yet" Icon={ChartLine}>
            There isn&apos;t enough data to generate a meaningful balance
            history. Add more transactions to track your financial trends over
            time.
          </InfoMessageBlock>
        )}
        {balanceHistory.length >= 3 && (
          <DashboardBalanceHistoryChart
            data={balanceHistory}
            className='lg:h-[367px] [&_[data-slot="chart"]]:lg:h-[271px] [&_[data-slot="chart"]]:lg:aspect-auto'
          />
        )}
      </div>
      <div className="grid gap-4">
        <Card className="pb-0!">
          {Boolean(transactions.length) && (
            <CardHeader className="border-b flex justify-between items-center py-4.5!">
              <Heading noMargin className="text-base!">
                Recent Activity
              </Heading>
              <Link
                href="/transactions"
                className="inline-flex items-center gap-2"
              >
                <span>See all</span>
                <ArrowRight />
              </Link>
            </CardHeader>
          )}
          <TransactionList
            items={transactions}
            className="-mx-6 [&_[data-slot='list-item']]:first:[&>:not(style)]:rounded-t-none"
          />
        </Card>
      </div>
    </section>
  );
};
