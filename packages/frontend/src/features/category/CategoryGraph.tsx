'use client';

import { ChartData, ChartOptions } from 'chart.js';
import { isAfter } from 'date-fns';
import { FC, useMemo } from 'react';

import {
  Theme,
  TransactionCategoryDto,
  TransactionMonthSummaryDto,
} from '$api/generated/financerApi';
import { baseChartOptions } from '$constants/graph/graph.settings';
import { monthAgoDate } from '$constants/months';
import { ChartWrapperDynamic } from '$elements/chart/chart-wrapper.dynamic';
import { formatDate } from '$utils/formatDate';
import { generateDateFromYearAndMonth } from '$utils/generateDateFromYearAndMonth';
import { setGradientLineGraphBackground } from '$utils/graph/setGradientLineGraphBackground';

type CategoryHistory = {
  dateStr: string;
  date: Date;
  balance: number;
};

type CategoryGraphProps = {
  transactionsMonthlySummaries?: TransactionMonthSummaryDto[];
  category: TransactionCategoryDto;
  userTheme: Theme;
};

export const CategoryGraph: FC<CategoryGraphProps> = ({
  transactionsMonthlySummaries,
  category,
  userTheme,
}) => {
  const categoryHistory: CategoryHistory[] = useMemo(() => {
    if (!category || !transactionsMonthlySummaries) return [];

    const transactionCategoryTransactionHistoryStack =
      transactionsMonthlySummaries
        .map(({ totalAmount, id: { year, month } }) => ({
          date: generateDateFromYearAndMonth(year, month),
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

  const labels = categoryHistory.map(({ dateStr }) => {
    return dateStr;
  });

  const monthAgoIndex = categoryHistory.indexOf(
    categoryHistory.find((tick) => isAfter(tick.date, monthAgoDate)) ||
      categoryHistory[0],
  );

  const startIndex =
    categoryHistory.length - monthAgoIndex > 12
      ? monthAgoIndex
      : categoryHistory.length - 12;

  const chartOptions = useMemo(() => {
    const customChartOptions = {
      ...baseChartOptions,
      scales: {
        ...baseChartOptions?.scales,
        x: {
          ...baseChartOptions?.scales?.x,
          min: startIndex,
        },
      },
    } as ChartOptions;

    return customChartOptions;
  }, [startIndex]);

  const chartData = useMemo(
    () =>
      ({
        labels,
        datasets: [
          {
            label: 'Balance',
            fill: true,
            borderColor: '#0f62fe',
            backgroundColor: setGradientLineGraphBackground,
            data: categoryHistory.map(({ balance }) => balance),
            tension: 0.25,
          },
        ],
      }) as ChartData,
    [categoryHistory, labels],
  );

  if (categoryHistory.length < 3) {
    return null;
  }

  return (
    <ChartWrapperDynamic
      type="line"
      data={chartData}
      options={chartOptions}
      userTheme={userTheme}
    />
  );
};
