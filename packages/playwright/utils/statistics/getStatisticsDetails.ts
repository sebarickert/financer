import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

type StatisticsDetails = {
  incomes: Decimal;
  expenses: Decimal;
  balance: Decimal;
};

export const getStatisticsDetails = async (
  page: Page,
): Promise<StatisticsDetails> => {
  await expect(page).toHaveURL('/statistics/', { timeout: 5000 });
  await expect(
    page.getByTestId('transaction-list-monthly-summary'),
  ).toBeVisible();

  const statisticsMonthlySummary = page.getByTestId(
    'transaction-list-monthly-summary',
  );

  const incomes =
    (await statisticsMonthlySummary
      .getByTestId('details-list-item')
      .getByText('Incomes')
      .evaluate((el) => el?.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const expenses =
    (await statisticsMonthlySummary
      .getByTestId('details-list-item')
      .getByText('Expenses')
      .evaluate((el) => el?.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const balance =
    (await statisticsMonthlySummary
      .getByTestId('radial-stacked-chart-label-main')
      .textContent()) ?? '';

  return {
    incomes: parseCurrency(incomes),
    expenses: parseCurrency(expenses),
    balance: parseCurrency(balance),
  };
};
