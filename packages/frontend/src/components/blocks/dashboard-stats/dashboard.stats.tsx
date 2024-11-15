import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/BalanceDisplay';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { currentMonthAndYearInLongFormat } from '$constants/months';
import {
  transactionTypeLabelMapping,
  transactionTypeThemeMapping,
} from '$constants/transaction/transactionTypeMapping';
import { AccountService } from '$ssr/api/account.service';
import { TransactionService } from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { capitalize } from '$utils/capitalize';
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

  const monthlyDetails: DetailsItem[] = [
    {
      icon: transactionTypeThemeMapping[TransactionType.Income].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(totalIncomes) ?? '-',
    },
    {
      icon: transactionTypeThemeMapping[TransactionType.Expense].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(totalExpenses) ?? '-',
    },
    {
      icon: 'EqualsIcon',
      label: 'Balance',
      description: formatCurrency(totalIncomes - totalExpenses) ?? '-',
    },
  ];

  return (
    <section className={clsx('@container')} data-testid="dashboard-stats">
      <div className={clsx('grid @2xl:grid-cols-2 gap-2')}>
        <div className="grid gap-8 p-6 py-8 rounded-md theme-layer-color">
          <BalanceDisplay amount={balance} testId={'dashboard-balance'}>
            Balance
          </BalanceDisplay>
        </div>
        <div className="p-6 rounded-md theme-layer-color">
          <DetailsList
            heading={currentMonthAndYearInLongFormat}
            items={monthlyDetails}
          />
        </div>
      </div>
    </section>
  );
};
