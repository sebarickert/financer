import { ChartOptions } from 'chart.js';
import clsx from 'clsx';
import { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';

import {
  useExpensesFindMonthlySummariesByuserQuery,
  useIncomesFindMonthlySummariesByuserQuery,
} from '$api/generated/financerApi';
import { colorPalette } from '$constants/colorPalette';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { useUserDashboardSettings } from '$hooks/settings/user-preference/useDashboardSettings';
import { useLatestTransaction } from '$hooks/transaction/useLatestTransaction';
import { useTotalBalance } from '$hooks/useTotalBalance';
import {
  formatCurrencyAbbreviation,
  formatCurrency,
} from '$utils/formatCurrency';
import { formatDateShort } from '$utils/formatDate';

export type BalanceHistory = {
  date: Date;
  balance: number;
};

interface BalanceGraphProps {
  className?: string;
}

const yearAgoFilterOptions = {
  year: new Date().getFullYear() - 1,
  month: new Date().getMonth(),
};

export const BalanceGraph = ({
  className = '',
}: BalanceGraphProps): JSX.Element => {
  const { data: dashboardSettings } = useUserDashboardSettings();
  const accountTypeFilter = { accountTypes: dashboardSettings?.accountTypes };

  const { data: totalBalance } = useTotalBalance(accountTypeFilter);
  const { data: latestTransaction } = useLatestTransaction();

  const incomeMonthSummaryData = useIncomesFindMonthlySummariesByuserQuery({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });

  const expenseMonthSummary = useExpensesFindMonthlySummariesByuserQuery({
    ...yearAgoFilterOptions,
    ...accountTypeFilter,
  });

  const { data: incomeMonthSummaries } = incomeMonthSummaryData;
  const { data: expenseMonthSummaries } = expenseMonthSummary;

  const balanceHistory: BalanceHistory[] = useMemo(() => {
    if (!incomeMonthSummaries || !expenseMonthSummaries || !latestTransaction)
      return [];

    const getDateFromYearAndMonth = (year: number, month: number): Date =>
      new Date(`${year}-${month.toString().padStart(2, '0')}-01`);

    const groupedIncomesFormatted = incomeMonthSummaries.map(
      ({ _id: { month, year }, totalAmount }) => ({
        date: getDateFromYearAndMonth(year, month),
        amount: totalAmount,
      })
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const groupedExpensesFormatted = expenseMonthSummaries.map(
      ({ _id: { month, year }, totalAmount }) => ({
        date: getDateFromYearAndMonth(year, month),
        amount: totalAmount * -1,
      })
    );

    const allIncomesAndExpenses = [
      ...groupedIncomesFormatted.map(({ date, amount }) => ({
        date,
        amount:
          amount +
          (groupedExpensesFormatted.find(
            ({ date: expenseDate }) => expenseDate.getTime() === date.getTime()
          )?.amount || 0),
      })),
      ...groupedExpensesFormatted.filter(
        ({ date }) =>
          !groupedIncomesFormatted.some(
            ({ date: incomeDate }) => incomeDate.getTime() === date.getTime()
          )
      ),
    ];

    const latestTransactionTimestamp = new Date(
      latestTransaction?.date ?? new Date()
    );

    const newBalanceHistory = allIncomesAndExpenses
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .reduce(
        (previousBalance, { date, amount }) => {
          const { balance: latestBalance } = previousBalance[0];
          const currentBalance = { date, balance: latestBalance - amount };
          return [currentBalance, ...previousBalance];
        },
        [{ date: latestTransactionTimestamp, balance: totalBalance }]
      );

    return newBalanceHistory.length > 12
      ? newBalanceHistory.slice(-12)
      : newBalanceHistory;
  }, [
    expenseMonthSummaries,
    incomeMonthSummaries,
    latestTransaction,
    totalBalance,
  ]);

  const labels = balanceHistory.map(({ date }, index) => {
    if (balanceHistory.length - 1 === index) {
      return 'Current';
    }

    return formatDateShort(date);
  });

  const options: ChartOptions = {
    maintainAspectRatio: false,
    layout: {
      autoPadding: false,
      padding: {
        right: -10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          padding: 0,
          autoSkip: false,
          maxRotation: 0,
          callback: function (val, index, ticks) {
            if (ticks.length === 1) return null;

            if (ticks.length <= 3) return this.getLabelForValue(Number(val));

            if (index === 0 || ticks.length - 1 === index) return null;

            if (ticks.length === 4) {
              return this.getLabelForValue(Number(val));
            }

            if (ticks.length % 3 === 0) {
              return index % 3 === 1
                ? this.getLabelForValue(Number(val))
                : null;
            }

            return index % 2 === 1 ? this.getLabelForValue(Number(val)) : null;
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
    },
  };

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
        data: balanceHistory.map(({ balance }) => balance),
      },
    ],
  };
  return (
    <section
      className={clsx(
        'min-h-[300px] h-[20vh] md:min-h-[500px] md:aspect-auto relative max-lg:-mx-4 pb-1',
        {
          [className]: true,
        }
      )}
    >
      <ChartWrapperDynamic>
        <Chart type="line" data={data} options={options} />
      </ChartWrapperDynamic>
    </section>
  );
};
