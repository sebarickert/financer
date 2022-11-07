import clsx from 'clsx';

import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useUserDashboardSettings } from '../../hooks/profile/user-preference/useDashboardSettings';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';

import { DashboardStatsItem } from './dashboard.stats.item';

interface DashboardStatsProps {
  className?: string;
}

const currentMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
const emptyTotalAmount = { totalAmount: 0 };

export const DashboardStats = ({
  className = '',
}: DashboardStatsProps): JSX.Element => {
  const [dashboardSettings] = useUserDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const totalBalance = useTotalBalance(accountTypeFilter);
  const [{ totalAmount: totalIncomes } = emptyTotalAmount] =
    useIncomeMonthlySummaries({
      ...currentMonthFilterOptions,
      ...accountTypeFilter,
    });
  const [{ totalAmount: totalExpenses } = emptyTotalAmount] =
    useExpenseMonthlySummaries({
      ...currentMonthFilterOptions,
      ...accountTypeFilter,
    });

  return (
    <section
      className={clsx('grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3', {
        [className]: true,
      })}
    >
      <DashboardStatsItem
        label="Balance"
        itemType={'balance'}
        className={'max-md:col-span-full'}
        isLarge
      >
        {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
      </DashboardStatsItem>
      <DashboardStatsItem label="Incomes" itemType={'income'}>
        {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
      </DashboardStatsItem>
      <DashboardStatsItem label="Expenses" itemType={'expense'}>
        {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
      </DashboardStatsItem>
    </section>
  );
};
