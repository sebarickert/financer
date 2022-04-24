import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllExpensesPaged } from '../../hooks/expense/useAllExpenses';
import { useExpenseMonthlySummaries } from '../../hooks/expense/useExpenseMonthlySummaries';
import { useTransactionCategoryName } from '../../hooks/transactionCategories/useTransactionCategoryName';
import { formatCurrency } from '../../utils/formatCurrency';

import { convertExpenseToTransactionStackedListRow } from './ExpenseFuctions';

type ExpensesMonthSummaryProps = {
  year: number;
  month: number;
  total: number;
};

const ExpensesMonthSummary = ({
  year,
  month,
  total,
}: ExpensesMonthSummaryProps) => {
  const getCategoryName = useTransactionCategoryName();
  const { data, pagerOptions } = useAllExpensesPaged(1, {
    year,
    month,
  });

  return (
    <section
      className="mb-12"
      aria-label={`IOverview of income transactions for ${
        monthNames[month - 1]
      }, ${year}`}
    >
      <div className="grid grid-cols-[1fr,auto] gap-4 items-end justify-between sticky top-[-1px] z-10 bg-white py-4 -mt-4">
        <Heading>{`${monthNames[month - 1]}, ${year}`}</Heading>
        <p className="font-semibold text-gray-600">
          <span className="sr-only">Total: </span>
          {Number.isNaN(total) ? '-' : formatCurrency(total)}
        </p>
      </div>
      <TransactionStackedList
        rows={data.data.map((expense) =>
          convertExpenseToTransactionStackedListRow(expense, getCategoryName)
        )}
        pagerOptions={pagerOptions}
      />
    </section>
  );
};

export const Expenses = (): JSX.Element => {
  const expenseMontlySummaries = useExpenseMonthlySummaries();

  return (
    <>
      <UpdatePageInfo title="Expenses" />
      <section className="mb-8">
        <QuickLinksItem
          title="Add expense"
          link="/statistics/expenses/add"
          iconName={IconName.download}
          iconBackgroundColor="red"
          testId="add-expense"
        />
      </section>
      {expenseMontlySummaries.map(({ _id: { year, month }, totalAmount }) => (
        <LoaderSuspense>
          <ExpensesMonthSummary
            key={`${year}-${month}`}
            year={year}
            month={month}
            total={totalAmount}
          />
        </LoaderSuspense>
      ))}
    </>
  );
};
