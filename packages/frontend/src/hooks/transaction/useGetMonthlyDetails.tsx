import { useMemo } from 'react';

import { useTransactionsFindMonthlySummariesByUserQuery } from '$api/generated/financerApi';
import { IconName } from '$elements/icon/icon';
import { useUserStatisticsSettings } from '$hooks/settings/user-preference/useStatisticsSettings';
import { formatCurrency } from '$utils/formatCurrency';

// @TODO: create filterOptions type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useGetMonthlyDetails = (filterOptions: any) => {
  const { data: statisticsSettings } = useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const { data: transactionMonthSummaryData } =
    useTransactionsFindMonthlySummariesByUserQuery({
      ...filterOptions,
      ...accountTypeFilter,
    });

  const { incomeAmount: totalIncomes = 0, expenseAmount: totalExpenses = 0 } =
    transactionMonthSummaryData?.at(-1) ?? {};

  const monthlyDetails = useMemo(
    () => [
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
          <span className="text-red">
            {formatCurrency(totalExpenses) ?? '-'}
          </span>
        ),
      },
      {
        icon: IconName.plus,
        label: 'Net Total',
        description: formatCurrency(totalIncomes - totalExpenses) ?? '-',
      },
    ],
    [totalExpenses, totalIncomes],
  );

  return monthlyDetails;
};
