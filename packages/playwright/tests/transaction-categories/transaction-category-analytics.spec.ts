import { Response } from '@playwright/test';

import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction category analytics', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

  test('Should return correct amounts when category has incomes and expenses', async ({
    page,
  }) => {
    // 623b58ada3deba9879422fbf = Category for all types
    const response = (await page.goto(
      '/api/transactions/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=623b58ada3deba9879422fbf',
    )) as Response;
    expect(response.status()).toBe(200);
    const [body] = await response.json();

    expect(body.totalCount).toBe(4);
    expect(body.incomesCount).toBe(2);
    expect(body.expensesCount).toBe(2);
    expect(body.transfersCount).toBe(0);

    expect(roundToTwoDecimals(body.totalAmount)).toBe(872.95);
    expect(roundToTwoDecimals(body.incomeAmount)).toBe(3367.11);
    expect(roundToTwoDecimals(body.expenseAmount)).toBe(2494.16);
    expect(roundToTwoDecimals(body.transferAmount)).toBe(0);
  });

  test('Should return correct amounts', async ({ page }) => {
    // 623b58ada3deba9879422fbf = Category for all types
    const response = (await page.goto(
      '/api/transaction-categories/623b58ada3deba9879422fbf/summary?year=2022&month=01&page=1&limit=500',
    )) as Response;
    expect(response.status()).toBe(200);
    const [body] = await response.json();

    expect(body.total.count).toBe(4);
    expect(roundToTwoDecimals(body.total.amount)).toBe(1135.55);
    expect(roundToTwoDecimals(body.total.transactionAmount)).toBe(872.95);

    expect(body.income.count).toBe(2);
    expect(roundToTwoDecimals(body.income.amount)).toBe(2271.53);
    expect(roundToTwoDecimals(body.income.transactionAmount)).toBe(3367.11);

    expect(body.expense.count).toBe(2);
    expect(roundToTwoDecimals(body.expense.amount)).toBe(1135.98);
    expect(roundToTwoDecimals(body.expense.transactionAmount)).toBe(2494.16);

    expect(body.transfer.count).toBe(0);
    expect(roundToTwoDecimals(body.transfer.amount)).toBe(0);
    expect(roundToTwoDecimals(body.transfer.transactionAmount)).toBe(0);
  });
});
