import { SortOrder } from '@local/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Heading } from '../../components/heading/heading';
import { IconName } from '../../components/icon/icon';
import { LatestTransactions } from '../../components/latest-transactions/latest-transactions';
import { LinkList } from '../../components/link-list/link-list';
import { LinkListLink } from '../../components/link-list/link-list.link';
import { LoaderSuspense } from '../../components/loader/loader-suspense';
import { initialMonthFilterOptions } from '../../components/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../components/pager/pager';
import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { monthNames } from '../../constants/months';
import { useAllTransactionsPaged } from '../../hooks/transaction/useAllTransactions';
import { useAllTransfersPaged } from '../../hooks/transfer/useAllTransfers';

export const Transfers = (): JSX.Element => {
  const {
    year: initialYear,
    month: initialMonth,
    page: initialPage = '1',
  } = useParams<{ year?: string; month?: string; page?: string }>();
  const [selectedPage, setSelectedPage] = useState(parseInt(initialPage));

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    !initialYear || !initialMonth
      ? initialMonthFilterOptions
      : {
          year: parseInt(initialYear),
          month: parseInt(initialMonth),
          page: selectedPage,
        }
  );
  const {
    data: {
      data: [transaction],
    },
  } = useAllTransactionsPaged(1, {
    limit: 1,
    sortOrder: SortOrder.ASC,
  });

  const [initialPageToLoad, setInitialPage] = useState(selectedPage);

  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      pathname: `/statistics/transfers/${
        monthFilterOptions.year
      }-${monthFilterOptions.month
        .toString()
        .padStart(2, '0')}/${selectedPage}`,
    });

    setInitialPage(1);
  }, [
    monthFilterOptions.year,
    monthFilterOptions.month,
    navigate,
    selectedPage,
  ]);

  const firstTransactionEverDate = new Date(transaction?.date || new Date());

  const pageVisibleYear = monthFilterOptions.year;
  const pageVisibleMonth = monthNames[monthFilterOptions.month - 1];

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
    const { month, year } = monthFilterOptions;
    const monthWithTwoDigits = month.toString().padStart(2, '0');
    const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

    selectedMonth.setMonth(
      selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );

    setMonthFilterOptions({
      month: selectedMonth.getMonth() + 1,
      year: selectedMonth.getFullYear(),
    });
  };

  return (
    <>
      <UpdatePageInfo title="Transfers" />
      <section className="mb-8">
        <LinkList>
          <LinkListLink
            testId="add-transfer"
            link="/statistics/transfers/add"
            icon={IconName.switchHorizontal}
          >
            Add transfer
          </LinkListLink>
        </LinkList>
      </section>
      <section className="flex items-center justify-between mb-4">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                monthFilterOptions.month === initialMonthFilterOptions.month &&
                monthFilterOptions.year === initialMonthFilterOptions.year
              ),
              load: () => handleMonthOptionChange('next'),
            },
            previousPage: {
              isAvailable: !(
                monthFilterOptions.month ===
                  firstTransactionEverDate.getMonth() + 1 &&
                monthFilterOptions.year ===
                  firstTransactionEverDate.getFullYear()
              ),
              load: () => handleMonthOptionChange('previous'),
            },
          }}
        ></Pager>
      </section>
      <LoaderSuspense>
        <LatestTransactions
          filterOptions={monthFilterOptions}
          className="mt-4"
          useDataHook={useAllTransfersPaged}
          onPageChange={setSelectedPage}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
