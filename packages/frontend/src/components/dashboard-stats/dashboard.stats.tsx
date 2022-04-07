import { useCurrentMonthExpensesTotalAmount } from '../../hooks/expense/useAllExpenses';
import { useCurrentMonthIncomesTotalAmount } from '../../hooks/income/useAllIncomes';
import { useTotalBalance } from '../../hooks/useTotalBalance';
import { formatCurrency } from '../../utils/formatCurrency';

interface IDashboardStatsProps {
  className?: string;
}

export const DashboardStats = ({
  className = '',
}: IDashboardStatsProps): JSX.Element => {
  const totalBalance = useTotalBalance();
  const totalIncomes = useCurrentMonthIncomesTotalAmount();
  const totalExpenses = useCurrentMonthExpensesTotalAmount();

  return (
    <section className={`bg-gray-25 border rounded-lg ${className}`}>
      <dl className="relative px-6 pt-10 pb-6 border-b">
        <dt className="absolute text-sm font-medium text-gray-700 truncate lg:text-base top-4 left-6">
          Balance
        </dt>
        <dd className="text-3xl font-bold tracking-tight">
          {Number.isNaN(totalBalance) ? '-' : formatCurrency(totalBalance)}
        </dd>
      </dl>
      <section className="grid grid-cols-2 divide-x">
        <dl className="py-4 pl-6 pr-4">
          <dt className="text-xs font-medium text-gray-700 truncate lg:text-sm">
            Income
          </dt>
          <dd className="text-xl font-bold tracking-tight">
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </dd>
        </dl>
        <dl className="py-4 pl-6 pr-4">
          <dt className="text-xs font-medium text-gray-700 truncate lg:text-sm">
            Expenses
          </dt>
          <dd className="text-xl font-bold tracking-tight">
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </dd>
        </dl>
      </section>
    </section>
  );
};
