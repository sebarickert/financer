import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTransfersFindAllByUserQuery } from '$api/generated/financerApi';
import { LatestTransactions } from '$blocks/latest-transactions/latest-transactions';
import { initialMonthFilterOptions } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { monthNames } from '$constants/months';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseYearMonthFromString } from '$utils/formatDate';

export const Transfers = (): JSX.Element => {
  const { date: initialDate, page: initialPage = '1' } = useParams<{
    date?: string;
    page?: string;
  }>();
  const [selectedPage, setSelectedPage] = useState(parseInt(initialPage));

  const [monthFilterOptions, setMonthFilterOptions] = useState(
    !parseYearMonthFromString(initialDate)
      ? initialMonthFilterOptions
      : {
          ...initialMonthFilterOptions,
          ...parseYearMonthFromString(initialDate),
          page: selectedPage,
        }
  );
  const { data: transaction } = useFirstTransaction();

  const [initialPageToLoad, setInitialPage] = useState(selectedPage);

  const navigate = useNavigate();

  useEffect(() => {
    const month = monthFilterOptions?.month.toString().padStart(2, '0');
    const year = monthFilterOptions?.year;
    navigate({
      pathname: `/statistics/transfers/${year}-${month}`,
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
        />
      </section>
      <LoaderSuspense>
        <LatestTransactions
          filterOptions={monthFilterOptions}
          className="mt-4"
          useDataHook={useTransfersFindAllByUserQuery}
          onPageChange={setSelectedPage}
          initialPage={initialPageToLoad}
        />
      </LoaderSuspense>
    </>
  );
};
