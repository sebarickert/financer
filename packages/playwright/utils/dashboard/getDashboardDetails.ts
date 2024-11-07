import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

type DashboardDetails = {
  balance: Decimal;
  incomes: Decimal;
  expenses: Decimal;
  monthBalanceSummary: Decimal;
};

export const getDashboardDetails = async (
  page: Page,
): Promise<DashboardDetails> => {
  await expect(page).toHaveURL('/', { timeout: 5000 });
  await expect(page.getByTestId('dashboard-stats')).toBeVisible();

  const balance =
    (await page.getByTestId('dashboard-balance').textContent()) ?? '';

  const dashboardStats = page.getByTestId('dashboard-stats');

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

  const monthBalanceSummary =
    (await dashboardStats
      .getByTestId('details-list-item')
      .getByText('Balance')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  return {
    balance: parseCurrency(balance),
    incomes: parseCurrency(incomes),
    expenses: parseCurrency(expenses),
    monthBalanceSummary: parseCurrency(monthBalanceSummary),
  };
};
