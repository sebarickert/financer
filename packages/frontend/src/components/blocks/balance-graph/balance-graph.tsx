import { FC } from 'react';

import { BalanceGraphChart } from './balance-graph.chart';

import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserService } from '$ssr/api/user.service';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';

export type BalanceHistory = {
  date: Date;
  balance: number;
};

const yearAgo = new Date();
yearAgo.setFullYear(yearAgo.getFullYear() - 1);

const yearAgoFilterOptions = {
  year: yearAgo.getFullYear(),
  month: new Date().getMonth(),
};

export const BalanceGraph: FC = async () => {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();
    const theme = await UserService.getOwnUserTheme();
;
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const totalBalance = await AccountService.getTotalBalance(accountTypeFilter);
  const latestTransaction = await TransactionService.getLatestByType();

  if (!latestTransaction) {
    return null;
  }

  const transactionMonthSummary = await TransactionService.getMonthlySummary({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });

  const latestTransactionTimestamp = new Date(
    latestTransaction?.date ?? new Date(),
  );

  const newBalanceHistory = transactionMonthSummary
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

  const balanceHistory =
    newBalanceHistory.length > 12
      ? newBalanceHistory.slice(-12)
      : newBalanceHistory;

  return (
    <BalanceGraphChart balanceHistory={balanceHistory} userTheme={theme} />
  );
};
