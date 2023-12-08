import {
  TransactionsFindAllByUserApiArg,
  useExpensesFindAllByUserQuery,
  useExpensesFindMonthlySummariesByuserQuery,
  useIncomesFindAllByUserQuery,
  useIncomesFindMonthlySummariesByuserQuery,
  useTransactionsFindAllByUserQuery,
  useTransfersFindAllByUserQuery,
} from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { IconName } from '$elements/icon/icon';
import { Loader } from '$elements/loader/loader';
import { useUserStatisticsSettings } from '$hooks/settings/user-preference/useStatisticsSettings';
import { formatCurrency } from '$utils/formatCurrency';

const emptyTotalAmount = { totalAmount: 0 };

export const initialMonthFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
} satisfies TransactionsFindAllByUserApiArg;

interface MonthlyTransactionListProps {
  monthFilterOptions: TransactionsFindAllByUserApiArg;
  isSummaryVisible?: boolean;
  useDataHook?:
    | typeof useTransactionsFindAllByUserQuery
    | typeof useIncomesFindAllByUserQuery
    | typeof useExpensesFindAllByUserQuery
    | typeof useTransfersFindAllByUserQuery;
}

export const MonthlyTransactionList = ({
  monthFilterOptions,
  isSummaryVisible,
  useDataHook = useTransactionsFindAllByUserQuery,
}: MonthlyTransactionListProps) => {
  const { data: statisticsSettings, isLoading: isLoadingSettings } =
    useUserStatisticsSettings();
  const accountTypeFilter = { accountTypes: statisticsSettings?.accountTypes };

  const incomeMonthSummaryData = useIncomesFindMonthlySummariesByuserQuery({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });

  const expenseMonthSummary = useExpensesFindMonthlySummariesByuserQuery({
    ...monthFilterOptions,
    ...accountTypeFilter,
  });

  const { data: incomeSummaries } = incomeMonthSummaryData;
  const { data: expenseSummaries } = expenseMonthSummary;

  const { totalAmount: totalIncomes } =
    incomeSummaries?.at(-1) ?? emptyTotalAmount;
  const { totalAmount: totalExpenses } =
    expenseSummaries?.at(-1) ?? emptyTotalAmount;

  const isLoading = isLoadingSettings;

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

  if (isLoading) return <Loader />;

  return (
    <>
      {isSummaryVisible && (
        <DetailsList
          items={monthlyDetails}
          className="mb-4 py-4 border-t border-b border-gray-dark"
        />
      )}
      <LatestTransactions
        filterOptions={monthFilterOptions}
        useDataHook={useDataHook}
      />
    </>
  );
};
