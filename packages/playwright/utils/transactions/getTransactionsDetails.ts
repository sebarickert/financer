import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

interface TransactionsDetails {
  incomes: Decimal;
  expenses: Decimal;
  balance: Decimal;
}

export const getTransactionsDetails = async (
  page: Page,
): Promise<TransactionsDetails> => {
  await expect(page).toHaveURL('/transactions/', { timeout: 5000 });
  await expect(
    page.getByTestId('transaction-list-monthly-summary'),
  ).toBeVisible();

  const transactionsMonthlySummary = page.getByTestId(
    'transaction-list-monthly-summary',
  );

  const incomes =
    (await transactionsMonthlySummary
      .getByTestId('details-list-item')
      .getByText('Incomes')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const expenses =
    (await transactionsMonthlySummary
      .getByTestId('details-list-item')
      .getByText('Expenses')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const balance =
    (await transactionsMonthlySummary
      .getByTestId('balance-amount')
      .textContent()) ?? '';

  return {
    incomes: parseCurrency(incomes),
    expenses: parseCurrency(expenses),
    balance: parseCurrency(balance),
  };
};
