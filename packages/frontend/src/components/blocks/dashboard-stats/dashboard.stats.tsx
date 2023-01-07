import clsx from 'clsx';

import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { Loader } from '$elements/loader/loader';
import { useExpenseMonthlySummaries } from '$hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '$hooks/income/useIncomeMonthlySummaries';
import { useUserDashboardSettings } from '$hooks/profile/user-preference/useDashboardSettings';
import { useTotalBalance } from '$hooks/useTotalBalance';
import { formatCurrency } from '$utils/formatCurrency';

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

  const { data: totalBalance, isFetching: isLoadingTotalBalance } =
    useTotalBalance(accountTypeFilter);
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

  const isLoading = isLoadingTotalBalance;

  return (
    <Loader isLoading={isLoading}>
      <section
        className={clsx('grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3', {
          [className]: true,
        })}
      >
        <InfoCard
          iconName={IconName.documentReport}
          label="Balance"
          isLarge
          className={'max-md:col-span-full'}
        >
          {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
        </InfoCard>
        <InfoCard iconName={IconName.download} label="Incomes">
          {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
        </InfoCard>
        <InfoCard iconName={IconName.upload} label="Expenses">
          {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
        </InfoCard>
      </section>
    </Loader>
  );
};
