import { ChartOptions } from 'chart.js';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';

import { TransactionCategoryDeleteModal } from './TransactionCategoryDeleteModal';

import {
  TransactionsFindMonthlySummariesByUserApiArg,
  useTransactionsFindMonthlySummariesByUserQuery,
} from '$api/generated/financerApi';
import { MonthlyTransactionList } from '$blocks/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '$blocks/pager/pager';
import { colorPalette } from '$constants/colorPalette';
import { monthNames, MONTH_IN_MS } from '$constants/months';
import { Heading } from '$elements/heading/heading';
import { IconName } from '$elements/icon/icon';
import { InfoCard } from '$elements/info-card/info-card';
import { LinkList } from '$elements/link-list/link-list';
import { LinkListLink } from '$elements/link-list/link-list.link';
import { LoaderSuspense } from '$elements/loader/loader-suspense';
import { useFirstTransaction } from '$hooks/transaction/useFirstTransaction';
import { useDeleteTransactionCategory } from '$hooks/transactionCategories/useDeleteTransactionCategory';
import { useTransactionCategoryById } from '$hooks/transactionCategories/useTransactionCategoryById';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';

const initialFilterOptions: TransactionsFindMonthlySummariesByUserApiArg = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

interface ChartData {
  dateStr: string;
  date: Date;
  balance: number;
}

export const ViewTransactionCategory = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [monthFilterOptions, setMonthFilterOptions] =
    useState(initialFilterOptions);

  const transactionCategory = useTransactionCategoryById(id);
  const deleteTransactionCategory = useDeleteTransactionCategory();

  const { data: transaction } = useFirstTransaction({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    parentTransactionCategory: id,
  });

  const firstTransactionEverDate = new Date(transaction?.date || new Date());

  const pageVisibleYear = monthFilterOptions.year;
  const pageVisibleMonth = monthNames[(monthFilterOptions?.month ?? 1) - 1];

  const handleMonthOptionChange = (direction: 'next' | 'previous') => {
    const { month, year } = monthFilterOptions;
    const monthWithTwoDigits = month?.toString().padStart(2, '0');
    const selectedMonth = new Date(`${year}-${monthWithTwoDigits}-01`);

    selectedMonth.setMonth(
      selectedMonth.getMonth() + (direction === 'next' ? 1 : -1)
    );

    setMonthFilterOptions({
      ...monthFilterOptions,
      month: selectedMonth.getMonth() + 1,
      year: selectedMonth.getFullYear(),
    });
  };

  useEffect(() => {
    if (!id) return;

    setMonthFilterOptions({
      ...initialFilterOptions,
      parentTransactionCategory: id,
    });
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transaction category: no id');
      return;
    }
    deleteTransactionCategory(id);
    navigate('/profile/transaction-categories');
  };

  const { data: transactionsMonthlySummaries } =
    useTransactionsFindMonthlySummariesByUserQuery({
      parentTransactionCategory: id,
    });

  const chartData: ChartData[] = useMemo(() => {
    if (!transactionCategory || !transactionsMonthlySummaries) return [];

    const getDateFromYearAndMonth = (year: number, month: number): Date =>
      new Date(`${year}-${month.toString().padStart(2, '0')}-01`);

    const transactionCategoryTransactionHistoryStack =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (transactionsMonthlySummaries as any[])
        .map(({ totalAmount, _id: { year, month } }) => ({
          date: getDateFromYearAndMonth(year, month),
          amount: totalAmount,
        }))
        .map(({ date, amount }) => ({
          date: new Date(date),
          balance: amount,
          dateStr: formatDate(new Date(date)),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    return transactionCategoryTransactionHistoryStack;
  }, [transactionCategory, transactionsMonthlySummaries]);

  const labels = chartData.map(({ dateStr }) => {
    return dateStr;
  });

  const monthAgoDate = new Date().getTime() - MONTH_IN_MS;

  const monthAgoIndex = chartData.indexOf(
    chartData.find((tick) => tick.date.getTime() > monthAgoDate) || chartData[0]
  );

  const startIndex =
    chartData.length - monthAgoIndex > 12
      ? monthAgoIndex
      : chartData.length - 12;

  const options: ChartOptions = useMemo(() => {
    return {
      animation: false,
      maintainAspectRatio: false,
      layout: {
        autoPadding: false,
        padding: {
          right: -10,
        },
      },
      scales: {
        x: {
          min: startIndex,
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            padding: 0,
            maxRotation: 0,
            callback: function (val, index, ticks) {
              if (ticks.length === 1) return null;

              if (ticks.length <= 3) return this.getLabelForValue(Number(val));

              if (index === 0 || ticks.length - 1 === index) return null;

              return this.getLabelForValue(Number(val));
            },
            color: colorPalette.charcoal,
            font: {
              size: 13,
              family: 'Inter',
              lineHeight: 1.5,
            },
          },
        },
        y: {
          position: 'right',
          grid: {
            color: colorPalette['gray-dark'],
            drawBorder: false,
          },
          ticks: {
            mirror: true,
            padding: 0,
            callback: function (val, index, ticks) {
              if (index % 2 === 0 || ticks.length - 1 === index) return null;

              return `${formatCurrencyAbbreviation(Number(val))} `;
            },
          },
        },
      },
      elements: {
        point: {
          hitRadius: 32,
          radius: 0,
          hoverBorderWidth: 3,
          hoverRadius: 3,
          hoverBorderColor: colorPalette.blue,
          hoverBackgroundColor: colorPalette.blue,
        },
        line: {
          borderWidth: 2,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        filler: {
          propagate: true,
        },
        tooltip: {
          backgroundColor: colorPalette.charcoal,
          padding: 16,
          mode: 'index',
          intersect: true,
          position: 'nearest',
          bodySpacing: 6,
          displayColors: false,
          titleFont: {
            size: 16,
            family: 'Inter',
            weight: '600',
          },
          bodyFont: {
            size: 16,
            family: 'Inter',
          },
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';

              if (!context.parsed.y) {
                return label;
              }

              return `${label} ${formatCurrency(context.parsed.y as number)}`;
            },
          },
        },
        zoom: {
          limits: {
            x: { minRange: 5 },
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.5,
            },
            drag: {
              enabled: true,
              modifierKey: 'ctrl',
              backgroundColor: `${colorPalette.blue}1A`,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
      },
    };
  }, [startIndex]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        borderColor: colorPalette.blue,
        fill: {
          target: 'origin',
          above: `${colorPalette.blue}1A`,
          below: `${colorPalette.blue}1A`,
        },
        data: chartData.map(({ balance }) => balance),
      },
    ],
  };

  return (
    <Container>
      <UpdatePageInfo
        title={`${transactionCategory.name}`}
        backLink="/profile/transaction-categories"
      />
      <section className={'mb-6 grid md:grid-cols-2 gap-4 md:gap-6'}>
        <section className={clsx('grid gap-2')}>
          <InfoCard label="Type" testId="transaction-category-type" isLarge>
            {capitalize(transactionCategory.visibility.join(', '))}
          </InfoCard>
        </section>
        <LinkList isVertical>
          <LinkListLink
            link={`/profile/transaction-categories/${id}/edit`}
            testId="edit-transaction-category"
            icon={IconName.cog}
          >
            Edit transaction category
          </LinkListLink>
          <TransactionCategoryDeleteModal handleDelete={handleDelete} />
        </LinkList>
      </section>
      {!chartData?.length ? null : (
        <div className="min-h-[300px] h-[20vh] md:h-auto md:min-h-0 md:aspect-video -mx-4 md:-mx-0">
          <Chart type="line" data={data} options={options} />
        </div>
      )}
      <section className="flex items-center justify-between mt-6 mb-2">
        <Heading>{`${pageVisibleMonth}, ${pageVisibleYear}`}</Heading>
        <Pager
          pagerOptions={{
            nextPage: {
              isAvailable: !(
                monthFilterOptions.month === initialFilterOptions.month &&
                monthFilterOptions.year === initialFilterOptions.year
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
        <MonthlyTransactionList monthFilterOptions={monthFilterOptions} />
      </LoaderSuspense>
    </Container>
  );
};
