import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';
import { DescriptionList } from '../description-list/description-list';
import { DescriptionListItem } from '../description-list/description-list.item';

interface IDashboardStatsProps {
  className?: string;
}

const currentMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

export const DashboardStats = ({
  className = '',
}: IDashboardStatsProps): JSX.Element => {
  const totalBalance = useTotalBalance();
  const [{ totalAmount: totalIncomes }] = useIncomeMonthlySummaries(
    currentMonthFilterOptions
  );
  const [{ totalAmount: totalExpenses }] = useExpenseMonthlySummaries(
    currentMonthFilterOptions
  );

  return (
    <DescriptionList className={className}>
      <DescriptionListItem label="Balance" isLarge>
        {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
      </DescriptionListItem>
      <DescriptionListItem label="Income">
        {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
      </DescriptionListItem>
      <DescriptionListItem label="Expenses">
        {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
      </DescriptionListItem>
    </DescriptionList>
  );
};
