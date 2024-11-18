import clsx from 'clsx';
import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { DetailsList } from '$blocks/details-list/details-list';
import { DetailsItem } from '$blocks/details-list/details-list.item';
import { RadialStackedChart } from '$blocks/RadialStackedChart';
import { monthNames } from '$constants/months';
import {
  transactionTypeLabelMapping,
  transactionTypeThemeMapping,
} from '$constants/transaction/transactionTypeMapping';
import { Heading } from '$elements/Heading';
import {
  TransactionListOptions,
  TransactionService,
} from '$ssr/api/transaction.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
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
      icon: transactionTypeThemeMapping[TransactionType.Income].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Income].plural,
      ),
      description: formatCurrency(monthlySummary.incomeAmount) ?? '-',
    },
    {
      icon: transactionTypeThemeMapping[TransactionType.Expense].icon,
      label: capitalize(
        transactionTypeLabelMapping[TransactionType.Expense].plural,
      ),
      description: formatCurrency(monthlySummary.expenseAmount) ?? '-',
    },
  ];

  const { year, month } = monthlySummary.id;
  const heading = `${monthNames[month - 1]} ${year}`;

  const chartData = {
    key1: {
      key: 'expense',
      fill: transactionTypeThemeMapping[TransactionType.Expense].hex as string,
      value: monthlySummary.expenseAmount,
    },
    key2: {
      key: 'income',
      fill: transactionTypeThemeMapping[TransactionType.Income].hex as string,
      value: monthlySummary.incomeAmount,
    },
  };

  const chartLabel = {
    main: formatCurrency(monthlySummary.totalAmount),
    sub: 'Balance',
  };

  return (
    <div
      className={clsx('p-6 rounded-md theme-layer-color', '@container')}
      data-testid="transaction-list-monthly-summary"
    >
      <Heading disableResponsiveSizing>{heading}</Heading>
      <div className="@lg:grid @lg:grid-cols-[auto,1fr] @lg:gap-8">
        <RadialStackedChart
          chartData={chartData}
          label={chartLabel}
          className="max-w-[200px] -mb-14 mx-auto @lg:-mb-20 pointer-events-none"
        />
        <DetailsList items={monthlyDetails} className="@lg:self-center" />
      </div>
    </div>
  );
};
