import {
  useIncomesFindMonthlySummariesByuserQuery,
  useExpensesFindMonthlySummariesByuserQuery,
} from '$api/generated/financerApi';
import { BalanceDisplay } from '$blocks/balance-display/balance-display';
import { DetailsList } from '$blocks/details-list/details-list';
import { IconName } from '$elements/icon/icon';
import { useUserDashboardSettings } from '$hooks/settings/user-preference/useDashboardSettings';
import { useTotalBalance } from '$hooks/useTotalBalance';
import { formatCurrency } from '$utils/formatCurrency';

interface DashboardStatsProps {
  className?: string;
}

const currentMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
const emptyTotalAmount = [{ totalAmount: 0 }];

export const DashboardStats = ({
  className = '',
}: DashboardStatsProps): JSX.Element => {
  const { data: dashboardSettings } = useUserDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const { data: totalBalance } = useTotalBalance(accountTypeFilter);

  const incomeMonthSummaryData = useIncomesFindMonthlySummariesByuserQuery({
    ...currentMonthFilterOptions,
    ...accountTypeFilter,
  });

  const expenseMonthSummary = useExpensesFindMonthlySummariesByuserQuery({
    ...currentMonthFilterOptions,
    ...accountTypeFilter,
  });

  const { data: [{ totalAmount: totalIncomes }] = emptyTotalAmount } =
    incomeMonthSummaryData;
  const { data: [{ totalAmount: totalExpenses }] = emptyTotalAmount } =
    expenseMonthSummary;

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
    <>
      <BalanceDisplay className={className} amount={balance}>
        Balance
      </BalanceDisplay>
      <DetailsList
        items={monthlyDetails}
        className="py-4 border-t border-b border-gray-dark"
      />
    </>
  );
};
