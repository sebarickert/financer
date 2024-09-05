import clsx from 'clsx';
import { FC } from 'react';

import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { currentMonthAndYearInLongFormat } from '$constants/months';
import { IconName } from '$elements/icon/icon';
import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { formatCurrency } from '$utils/formatCurrency';

const currentMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
const emptyTotalAmount = 0;

export const DashboardStats: FC = async () => {
  const dashboardSettings = await UserPreferenceService.getDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const totalBalance = await AccountService.getTotalBalance(dashboardSettings);

  const transactionMonthSummary = await TransactionService.getMonthlySummary({
    ...currentMonthFilterOptions,
    ...accountTypeFilter,
  });

  const {
    incomeAmount: totalIncomes = emptyTotalAmount,
    expenseAmount: totalExpenses = emptyTotalAmount,
  } =
    transactionMonthSummary?.find(
      ({ id }) =>
        id.month === currentMonthFilterOptions.month &&
        id.year === currentMonthFilterOptions.year,
    ) ?? {};

  const balance = Number.isNaN(totalBalance) ? 0 : totalBalance;

  const monthlyDetails = [
    {
      icon: IconName.download,
      label: 'Incomes',
      description: (
        <span className="text-green">
          {formatCurrency(totalIncomes) ?? '-'}
        </span>
      ),
    },
    {
      icon: IconName.upload,
      label: 'Expenses',
      description: (
        <span className="text-red">{formatCurrency(totalExpenses) ?? '-'}</span>
      ),
    },
    {
      icon: IconName.plus,
      label: 'Net Total',
      description: formatCurrency(totalIncomes - totalExpenses) ?? '-',
    },
  ];

  return (
    <section
      className={clsx(
        'lg:grid grid-cols-[1.5fr,2fr] lg:pb-6 lg:divide-x lg:divide-gray-dark',
      )}
    >
      <BalanceDisplay amount={balance}>Balance</BalanceDisplay>
      <DetailsList
        heading={currentMonthAndYearInLongFormat}
        items={monthlyDetails}
        className="max-lg:py-4 max-lg:border-t max-lg:border-gray-dark max-lg:mt-6 lg:pl-6"
      />
    </section>
  );
};
