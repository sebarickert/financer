import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

type TransactionRow = {
  description: string;
  amount: Decimal;
  date: Date;
  type: TransactionType;
};

export const getTransactionDataFromTransactionList = async (
  page: Page,
): Promise<TransactionRow[]> => {
  await expect(page.getByTestId('transaction-list').first()).toBeVisible();

  const transactionRows = (
    await page.getByTestId('transaction-list-item').evaluateAll((element) => {
      return Array.from(element).map((child) => {
        const description =
          child.querySelector('[data-testid="transaction-description"]')
            ?.textContent ?? '';
        const amount =
          child.querySelector('[data-testid="transaction-amount"]')
            ?.textContent ?? '';
        const date =
          child.querySelector('[data-testid="transaction-date"]')
            ?.textContent ?? '';
        const type = child
          .querySelector('[data-testid="transaction-amount"]')
          ?.getAttribute('data-transaction-type') as TransactionType;

        return { description, amount, date, type };
      });
    })
  ).map((row) => ({
    ...row,
    amount: parseCurrency(row.amount),
    date: new Date(row.date),
  }));

  return transactionRows;
};
