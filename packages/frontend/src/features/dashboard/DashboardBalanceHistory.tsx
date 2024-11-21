import clsx from 'clsx';
import { FC } from 'react';

import { DashboardBalanceHistoryChart } from './DashboardBalanceHistoryChart';

import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { formatCurrency } from '$utils/formatCurrency';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';

type DashboardBalanceHistoryProps = {
  className?: string;
};

export const DashboardBalanceHistory: FC<
  DashboardBalanceHistoryProps
> = async ({ className }) => {
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

  return (
    <div
      className={clsx(
        className,
        'grid gap-4 overflow-hidden rounded-md bg-layer',
      )}
    >
      <div className="p-6">
        <p className="text-muted-foreground">Balance</p>
        <p className={clsx('text-4xl font-semibold break-all')}>
          <span>{formatCurrency(totalBalance)}</span>
        </p>
      </div>
      {balanceHistory.length >= 3 && (
        <DashboardBalanceHistoryChart data={balanceHistory} />
      )}
    </div>
  );
};
