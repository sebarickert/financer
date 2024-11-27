import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

type DashboardDetails = {
  balance: Decimal;
  incomes: Decimal;
  expenses: Decimal;
  monthBalanceSummary: Decimal;
  transactionListItemCount: number;
};

export const getDashboardDetails = async (
  page: Page,
): Promise<DashboardDetails> => {
  await expect(page).toHaveURL('/', { timeout: 5000 });
  await expect(page.getByTestId('dashboard-balance-summary')).toBeVisible();
  await expect(page.getByTestId('transaction-list')).toBeVisible();

  const balance =
    (await page.getByTestId('balance-amount').textContent()) ?? '';

  const monthBalance =
    (await page.getByTestId('dashboard-month-balance').textContent()) ?? '';

  const dashboardStats = page.getByTestId('dashboard-balance-summary');

  const incomes =
    (await dashboardStats
      .getByTestId('details-list-item')
      .getByText('Incomes')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const expenses =
    (await dashboardStats
      .getByTestId('details-list-item')
      .getByText('Expenses')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const transactionListItemCount = await page
    .getByTestId('transaction-list')
    .getByTestId('transaction-list-item')
    .count();

  return {
    balance: parseCurrency(balance),
    incomes: parseCurrency(incomes),
    expenses: parseCurrency(expenses),
    monthBalanceSummary: parseCurrency(monthBalance),
    transactionListItemCount,
  };
};
