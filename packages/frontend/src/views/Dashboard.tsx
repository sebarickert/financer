import { ArrowRight, ChartLine, Layers, Tag } from 'lucide-react';
import { FC } from 'react';

import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { List } from '$blocks/List';
import { ProminentLink } from '$blocks/ProminentLink';
import { Button } from '$elements/Button/Button';
import { DashboardBalanceHistoryChart } from '$features/dashboard/DashboardBalanceHistoryChart';
import { DashboardBalanceSummary } from '$features/dashboard/DashboardBalanceSummary';
import { TransactionList } from '$features/transaction/TransactionList/TransactionList';
import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';

const currentMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

export const Dashboard: FC = async () => {
  const listChunkSizeSettings =
    await UserPreferenceService.getTransactionListChunkSize();

  const transactions = await TransactionService.getAllByType(null, {
    limit: listChunkSizeSettings ?? 5,
  });

  const dashboardSettings = await UserPreferenceService.getDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const totalBalance = await AccountService.getTotalBalance(accountTypeFilter);
  const latestTransaction = await TransactionService.getLatestByType();

  const transactionMonthSummary = await TransactionService.getMonthlySummary({
    ...accountTypeFilter,
  });

  const latestTransactionTimestamp = new Date(
    latestTransaction?.date ?? new Date(),
  );

  const balanceHistory = transactionMonthSummary
    .map(({ id: { month, year }, totalAmount }) => ({
      date: generateDateFromYearAndMonth(year, month),
      amount: totalAmount,
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .reduce(
      (previousBalance, { date, amount }) => {
        const { balance: latestBalance } = previousBalance[0];
        const currentBalance = { date, balance: latestBalance - amount };
        return [currentBalance, ...previousBalance];
      },
      [{ date: latestTransactionTimestamp, balance: totalBalance }],
    );

  const previousMonthBalance =
    balanceHistory[balanceHistory.length - 2]?.balance;

  const { incomeAmount: totalIncomes = 0, expenseAmount: totalExpenses = 0 } =
    transactionMonthSummary?.find(
      ({ id }) =>
        id.month === currentMonthFilterOptions.month &&
        id.year === currentMonthFilterOptions.year,
    ) ?? {};

  return (
    <section className="grid gap-6">
      <div className="grid lg:grid-cols-[1fr,2fr] gap-6">
        <div className="grid gap-6 self-baseline">
          <DashboardBalanceSummary
            {...{
              totalBalance,
              totalExpenses,
              totalIncomes,
              previousMonthBalance,
            }}
          />
          <List>
            <ProminentLink link="/settings/categories" Icon={Tag}>
              Categories
            </ProminentLink>
            <ProminentLink link="/settings/templates" Icon={Layers}>
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
            className='lg:h-[375px] [&_[data-slot="chart"]]:lg:h-[279px] [&_[data-slot="chart"]]:lg:aspect-auto'
          />
        )}
      </div>
      <div className="grid gap-4">
        <TransactionList label="Recent Activity" items={transactions} />
        {!!transactions.length && (
          <Button
            href="/statistics"
            accentColor="secondary"
            className="lg:ml-auto"
          >
            <span>See all</span>
            <ArrowRight />
          </Button>
        )}
      </div>
    </section>
  );
};
