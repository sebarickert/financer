import clsx from 'clsx';

import {
  TransactionsFindAllByUserApiArg,
  useExpensesFindAllByUserQuery,
  useExpensesFindMonthlySummariesByuserQuery,
  useIncomesFindAllByUserQuery,
  useIncomesFindMonthlySummariesByuserQuery,
  useTransactionsFindAllByUserQuery,
  useTransfersFindAllByUserQuery,
} from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { InfoCard } from '$elements/info-card/info-card';
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

  if (isLoading) return <Loader />;

  return (
    <>
      {isSummaryVisible && (
        <section
          className={clsx(
            'grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-3 mb-4'
          )}
        >
          <InfoCard label="Incomes" isSmall>
            {Number.isNaN(totalIncomes) ? '-' : formatCurrency(totalIncomes)}
          </InfoCard>
          <InfoCard label="Expenses" isSmall>
            {Number.isNaN(totalExpenses) ? '-' : formatCurrency(totalExpenses)}
          </InfoCard>
          <InfoCard label="Net total" isSmall className="max-md:col-span-full">
            {Number.isNaN(totalExpenses) && Number.isNaN(totalIncomes)
              ? '-'
              : formatCurrency(totalIncomes - totalExpenses)}
          </InfoCard>
        </section>
      )}
      <LatestTransactions
        filterOptions={monthFilterOptions}
        useDataHook={useDataHook}
      />
    </>
  );
};
