import { ChartOptions } from 'chart.js';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

import {
  TransactionCategoryDto,
  TransactionsFindMonthlySummariesByUserApiResponse,
} from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { TransactionListingWithMonthlyPager } from '$blocks/transaction-listing-with-monthly-pager/transaction-listing.with.monthly-pager';
import { colorPalette } from '$constants/colorPalette';
import { MONTH_IN_MS } from '$constants/months';
import { settingsPaths } from '$constants/settings-paths';
import { ButtonInternal } from '$elements/button/button.internal';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { Icon, IconName } from '$elements/icon/icon';
import { Container } from '$layouts/container/container';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';
import { formatDate } from '$utils/formatDate';
import { parseParentCategoryPath } from 'src/services/TransactionCategoriesService';

interface ChartData {
  dateStr: string;
  date: Date;
  balance: number;
}

interface CategoryProps {
  transactionsMonthlySummaries?: TransactionsFindMonthlySummariesByUserApiResponse;
  category: TransactionCategoryDto;
  categories: TransactionCategoryDto[];
  parentTransactionCategoryId: string;
}

export const Category = ({
  transactionsMonthlySummaries,
  category,
  categories,
  parentTransactionCategoryId,
}: CategoryProps): JSX.Element => {
  const monthAgoDate = new Date().getTime() - MONTH_IN_MS;

  const chartData: ChartData[] = useMemo(() => {
    if (!category || !transactionsMonthlySummaries) return [];

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

    return transactionCategoryTransactionHistoryStack;
  }, [category, transactionsMonthlySummaries]);

  const labels = chartData.map(({ dateStr }) => {
    return dateStr;
  });

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

  const categoryDetails = useMemo(() => {
    const categoryVisibilityCapitalized = category.visibility.map((item) =>
      capitalize(item)
    );

    const formatter = new Intl.ListFormat('en', {
      style: 'long',
      type: 'conjunction',
    });

    return [
      {
        icon: IconName.tag,
        label: 'Name',
        description: category.name,
      },
      ...(category.parent_category_id
        ? [
            {
              icon: IconName.viewGrid,
              label: 'Parent Category',
              description:
                parseParentCategoryPath(
                  categories,
                  category.parent_category_id
                ) ?? '-',
            },
          ]
        : []),
      {
        icon: IconName.informationCircle,
        label: 'Type',
        description: formatter.format(categoryVisibilityCapitalized),
      },
    ];
  }, [
    categories,
    category.name,
    category.parent_category_id,
    category.visibility,
  ]);

  return (
    <Container>
      <UpdatePageInfo
        title={'Category Details'}
        backLink={settingsPaths.categories}
        headerAction={
          <ButtonInternal
            link={`${settingsPaths.categories}/${category._id}/edit`}
            className="inline-flex items-center justify-center -mr-3 h-11 w-11"
            testId="edit-category"
          >
            <span className="sr-only">Edit</span>
            <Icon type={IconName.pencilSquare} />
          </ButtonInternal>
        }
      />
      <section>
        <DetailsList items={categoryDetails} className="mb-8" />
        {!chartData?.length ? null : (
          <div className="min-h-[300px] h-[20vh] md:h-auto md:min-h-0 md:aspect-video -mx-4 md:-mx-0">
            <ChartWrapperDynamic>
              <Chart type="line" data={data} options={options} />
            </ChartWrapperDynamic>
          </div>
        )}
        <TransactionListingWithMonthlyPager
          className="mt-6"
          additionalFilterOptions={{
            parentTransactionCategory: parentTransactionCategoryId,
          }}
        />
      </section>
    </Container>
  );
};
