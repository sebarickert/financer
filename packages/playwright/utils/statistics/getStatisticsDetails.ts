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
      .getByTestId('prominent-detail-item')
      .getByText('Incomes')
      .evaluate((el) => el?.nextElementSibling?.textContent)) ?? '';

  const expenses =
    (await statisticsMonthlySummary
      .getByTestId('prominent-detail-item')
      .getByText('Expenses')
      .evaluate((el) => el?.nextElementSibling?.textContent)) ?? '';

  const balance =
    (await statisticsMonthlySummary
      .getByTestId('prominent-detail-item')
      .getByText('Balance')
      .evaluate((el) => el?.nextElementSibling?.textContent)) ?? '';

  return {
    incomes: parseCurrency(incomes),
    expenses: parseCurrency(expenses),
    balance: parseCurrency(balance),
  };
};
