import { useCurrentMonthExpensesTotalAmount } from '../../hooks/expense/useAllExpenses';
import { useCurrentMonthIncomesTotalAmount } from '../../hooks/income/useAllIncomes';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';
import { DescriptionList } from '../description-list/description-list';
import { DescriptionListItem } from '../description-list/description-list.item';

interface IDashboardStatsProps {
  className?: string;
}

export const DashboardStats = ({
  className = '',
}: IDashboardStatsProps): JSX.Element => {
  const { data: totalBalance = NaN } = useTotalBalance();
  const totalIncomes = useCurrentMonthIncomesTotalAmount();
  const totalExpenses = useCurrentMonthExpensesTotalAmount();

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
