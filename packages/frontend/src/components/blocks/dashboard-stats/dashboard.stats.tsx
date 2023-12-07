import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { useUserDashboardSettings } from '$hooks/profile/user-preference/useDashboardSettings';
import { useTotalBalance } from '$hooks/useTotalBalance';

interface DashboardStatsProps {
  className?: string;
}

export const DashboardStats = ({
  className = '',
}: DashboardStatsProps): JSX.Element => {
  const { data: dashboardSettings } = useUserDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };
  const { data: totalBalance } = useTotalBalance(accountTypeFilter);

  const balance = Number.isNaN(totalBalance) ? 0 : totalBalance;

  return (
    <BalanceDisplay className={className} amount={balance}>
      Balance
    </BalanceDisplay>
  );
};
