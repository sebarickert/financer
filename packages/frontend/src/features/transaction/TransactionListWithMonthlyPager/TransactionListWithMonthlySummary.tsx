import clsx from 'clsx';
import { FC } from 'react';

import { TRANSACTION_TYPE_ICON_MAPPING } from '../TransactionTypeIcon';

import { TransactionType } from '$api/generated/financerApi';
import { DetailsList, DetailsItem } from '$blocks/DetailsList';
import { RadialStackedChart } from '$charts/RadialStackedChart';
import { transactionTypeLabelMapping } from '$constants/transaction/transactionTypeMapping';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/TransactionService';
import { UserPreferenceService } from '$ssr/api/UserPreferenceService';
import { ChartConfig } from '$types/ChartConfig';
import { ChartData } from '$types/ChartData';
import { capitalize } from '$utils/capitalize';
import { formatCurrency } from '$utils/formatCurrency';

type TransactionListWithMonthlySummaryProps = {
  filterOptions: TransactionListOptions;
};

export const TransactionListWithMonthlySummary: FC<
  TransactionListWithMonthlySummaryProps
> = async ({ filterOptions }) => {
  const statisticsSettings =
    await UserPreferenceService.getStatisticsSettings();

  const monthlySummary = (
    await TransactionService.getMonthlySummary({
      ...filterOptions,
      accountTypes: statisticsSettings?.accountTypes,
    })
  ).at(-1);

  if (!monthlySummary) {
    return null;
  }

  const monthlyDetails: DetailsItem[] = [
    {
      Icon: TRANSACTION_TYPE_ICON_MAPPING[TransactionType.Income],
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(monthlySummary.incomeAmount) ?? '-',
    },
    {
      Icon: TRANSACTION_TYPE_ICON_MAPPING[TransactionType.Expense],
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(monthlySummary.expenseAmount) ?? '-',
    },
  ];

  const chartData = [
    {
      dataKey: 'summary',
      expense: monthlySummary.expenseAmount,
      income: monthlySummary.incomeAmount,
    },
  ] satisfies ChartData;

  const chartConfig = {
    income: {
      label: 'Income',
      color: 'hsl(var(--color-green))',
    },
    expense: {
      label: 'Expense',
      color: 'hsl(var(--color-red))',
    },
  } satisfies ChartConfig;

  const chartLabel = {
    primary: formatCurrency(monthlySummary.totalAmount),
    secondary: 'Balance',
  };

  return (
    <div
      className={clsx('@container')}
      data-testid="transaction-list-monthly-summary"
    >
      <div className="@lg:grid @lg:grid-cols-[auto_1fr] @lg:gap-8">
        <RadialStackedChart
          data={chartData}
          config={chartConfig}
          label={chartLabel}
          className="max-w-[200px] -mb-14 mx-auto @lg:-mb-20 pointer-events-none"
        />
        <DetailsList items={monthlyDetails} className="@lg:self-center" />
      </div>
    </div>
  );
};
