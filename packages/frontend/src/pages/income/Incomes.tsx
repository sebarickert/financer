import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllIncomesPaged } from '../../hooks/income/useAllIncomes';
import { useIncomeMonthlySummaries } from '../../hooks/income/useIncomeMonthlySummaries';
import { useTransactionCategoryName } from '../../hooks/transactionCategories/useTransactionCategoryName';
import { formatCurrency } from '../../utils/formatCurrency';

import { convertIncomeToTransactionStackedListRow } from './IncomeFuctions';

type IncomesMonthSummaryProps = {
  year: number;
  month: number;
  total: number;
};

const IncomesMonthSummary = ({
  year,
  month,
  total,
}: IncomesMonthSummaryProps) => {
  const getCategoryName = useTransactionCategoryName();
  const { data, pagerOptions } = useAllIncomesPaged(1, {
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
        rows={data.data.map((income) =>
          convertIncomeToTransactionStackedListRow(income, getCategoryName)
        )}
        pagerOptions={pagerOptions}
      />
    </section>
  );
};

export const Incomes = (): JSX.Element => {
  const incomeMontlySummaries = useIncomeMonthlySummaries();

  return (
    <>
      <UpdatePageInfo title="Incomes" />
      <section className="mb-8">
        <QuickLinksItem
          title="Add income"
          link="/statistics/incomes/add"
          iconName={IconName.upload}
          iconBackgroundColor="green"
          testId="add-income"
        />
      </section>
      {incomeMontlySummaries.map(({ _id: { year, month }, totalAmount }) => (
        <LoaderSuspense>
          <IncomesMonthSummary
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
