import { FC } from 'react';

import { Button } from '$elements/Button/Button';
import { Icon } from '$elements/Icon';
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
      <DashboardBalanceSummary
        className="self-baseline"
        {...{
          totalBalance,
          totalExpenses,
          totalIncomes,
          previousMonthBalance,
        }}
      />
      {balanceHistory.length >= 3 && (
        <DashboardBalanceHistoryChart
          data={balanceHistory}
          className="self-baseline"
        />
      )}
      <div className="grid gap-4">
        <TransactionList label="Recent Activity" items={transactions} />
        {!!transactions.length && (
          <Button
            href="/statistics"
            accentColor="secondary"
            className="lg:ml-auto"
          >
            <span>See all</span>
            <Icon name="ArrowRightIcon" />
          </Button>
        )}
      </div>
    </section>
  );
};
