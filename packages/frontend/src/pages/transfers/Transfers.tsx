import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { QuickLinksItem } from '../../components/quick-links/quick-links.item';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionStackedList } from '../../components/transaction-stacked-list/transaction-stacked-list';
import { monthNames } from '../../constants/months';
import { useAllTransfersPaged } from '../../hooks/transfer/useAllTransfers';
import { useTransferMonthlySummaries } from '../../hooks/transfer/useTransferMonthlySummaries';
import { formatCurrency } from '../../utils/formatCurrency';

import { convertTransferToTransactionStackedListRow } from './TransferFuctions';

type IncomesMonthSummaryProps = {
  year: number;
  month: number;
  total: number;
};

const TransfersMonthSummary = ({
  year,
  month,
  total,
}: IncomesMonthSummaryProps) => {
  const { data, pagerOptions } = useAllTransfersPaged(1, {
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
        rows={data.data.map((transfer) =>
          convertTransferToTransactionStackedListRow({
            ...transfer,
            categoryMappings: [],
          })
        )}
        pagerOptions={pagerOptions}
      />
    </section>
  );
};

export const Transfers = (): JSX.Element => {
  const transferMontlySummaries = useTransferMonthlySummaries();

  return (
    <>
      <UpdatePageInfo title="Transfers" />
      <section className="mb-8">
        <QuickLinksItem
          title="Add transfer"
          link="/statistics/transfers/add"
          iconName={IconName.switchHorizontal}
          iconBackgroundColor="blue"
          testId="add-transfer"
        />
      </section>
      {transferMontlySummaries.map(({ _id: { year, month }, totalAmount }) => (
        <LoaderSuspense>
          <TransfersMonthSummary
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
