import { SortOrder } from '@local/types';
import { ChartOptions } from 'chart.js';
import { useEffect, useState, useTransition } from 'react';
import { Chart } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';

import { Container } from '../../../components/container/container';
import { DescriptionList } from '../../../components/description-list/description-list';
import { DescriptionListItem } from '../../../components/description-list/description-list.item';
import { Heading } from '../../../components/heading/heading';
import { IconName } from '../../../components/icon/icon';
import { LinkList } from '../../../components/link-list/link-list';
import { LinkListLink } from '../../../components/link-list/link-list.link';
import { LoaderSuspense } from '../../../components/loader/loader-suspense';
import { MonthlyTransactionList } from '../../../components/monthly-transaction-list/monthly-transaction-list';
import { Pager } from '../../../components/pager/pager';
import { UpdatePageInfo } from '../../../components/seo/updatePageInfo';
import { monthNames, MONTH_IN_MS } from '../../../constants/months';
import { useAllTransactionsPaged } from '../../../hooks/transaction/useAllTransactions';
import { useTransactionsMonthlySummaries } from '../../../hooks/transaction/useTransactionsMonthlySummaries';
import { useDeleteTransactionCategory } from '../../../hooks/transactionCategories/useDeleteTransactionCategory';
import { useTransactionCategoryById } from '../../../hooks/transactionCategories/useTransactionCategoryById';
import { TransactionFilterOptions } from '../../../services/TransactionService';
import { capitalize } from '../../../utils/capitalize';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

import { TransactionCategoryDeleteModal } from './TransactionCategoryDeleteModal';

const initialFilterOptions: {
  month: number;
  year: number;
} & TransactionFilterOptions = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

interface IChartData {
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

  const {
    data: {
      data: [transaction],
    },
  } = useAllTransactionsPaged(1, {
    limit: 1,
    sortOrder: SortOrder.ASC,
    parentTransactionCategory: id,
  });

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

  const [, startProcessing] = useTransition();
  const [chartData, setChartData] = useState<IChartData[]>([]);

  const handleDelete = async () => {
    if (!id) {
      console.error('Failed to delete transaction category: no id');
      return;
    }
    deleteTransactionCategory(id);
    navigate('/profile/transaction-categories');
  };

  const transactionsMonthlySummaries = useTransactionsMonthlySummaries({
    parentTransactionCategory: id,
  });

  useEffect(() => {
    if (!transactionCategory) return;

    startProcessing(() => {
      const getDateFromYearAndMonth = (year: number, month: number): Date =>
        new Date(`${year}-${month.toString().padStart(2, '0')}-01`);

      const transactionCategoryTransactionHistoryStack =
        transactionsMonthlySummaries
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

      setChartData(transactionCategoryTransactionHistoryStack);
    });
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

  const options: ChartOptions = {
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
          color: '#666666',
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
          color: '#cccccc40',
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
        hoverRadius: 5,
        hoverBorderColor: '#ffffff',
        hoverBackgroundColor: '#1c64f2',
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
        backgroundColor: 'rgb(31 41 55)',
        padding: 16,
        mode: 'index',
        intersect: true,
        position: 'nearest',
        bodySpacing: 6,
        displayColors: false,
        titleSpacing: 0,
        titleFont: {
          size: 16,
          family: 'Inter',
          weight: 'bold',
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
            backgroundColor: '#1c64f21A',
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        borderColor: '#1c64f2',
        fill: {
          target: 'origin',
          above: '#1c64f21A',
          below: '#1c64f21A',
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
      <section className={'mb-6 grid md:grid-cols-2 gap-6'}>
        <DescriptionList>
          <DescriptionListItem
            label="Type"
            testId="transaction-category-type"
            isLarge
          >
            {capitalize(transactionCategory.visibility.join(', '))}
          </DescriptionListItem>
          <DescriptionListItem label="Transactions">10</DescriptionListItem>
        </DescriptionList>
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
