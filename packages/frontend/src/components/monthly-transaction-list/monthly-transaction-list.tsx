import { useAllExpensesPaged } from '../../hooks/expense/useAllExpenses';
import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useAllIncomesPaged } from '../../hooks/income/useAllIncomes';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useUserStatisticsSettings } from '../../hooks/profile/user-preference/useStatisticsSettings';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';
import { useAllTransfersPaged } from '../../hooks/transfer/useAllTransfers';
import { TransactionFilterOptions } from '../../services/TransactionService';
import { formatCurrency } from '../../utils/formatCurrency';
import { DescriptionList } from '../description-list/description-list';
import { DescriptionListItem } from '../description-list/description-list.item';
import { LatestTransactions } from '../latest-transactions/latest-transactions';

const emptyTotalAmount = { totalAmount: 0 };

interface MonthlyTransactionListProps {
  monthFilterOptions: TransactionFilterOptions;
  isSummaryVisible?: boolean;
  useDataHook?:
    | typeof useAllTransactionsPaged
    | typeof useAllIncomesPaged
    | typeof useAllExpensesPaged
    | typeof useAllTransfersPaged;
}

export const MonthlyTransactionList = ({
  monthFilterOptions,
  isSummaryVisible,
  useDataHook = useAllTransactionsPaged,
}: MonthlyTransactionListProps) => {
  const [statisticsSettings] = useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const incomeSummaries = useIncomeMonthlySummaries({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });
  const expenseSummaries = useExpenseMonthlySummaries({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });

  const { totalAmount: totalIncomes } =
    incomeSummaries.at(-1) ?? emptyTotalAmount;
  const { totalAmount: totalExpenses } =
    expenseSummaries.at(-1) ?? emptyTotalAmount;

  return (
    <>
      {isSummaryVisible && (
        <DescriptionList>
          <DescriptionListItem label="Incomes">
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </DescriptionListItem>
          <DescriptionListItem label="Expenses">
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </DescriptionListItem>
        </DescriptionList>
      )}
      <LatestTransactions
        filterOptions={monthFilterOptions}
        className="mt-4"
        useDataHook={useDataHook}
      />
    </>
  );
};
