import { Response } from '@playwright/test';

import { TransactionCategoryDto } from '$types/generated/financer';
import { applyFixture } from '$utils/applyFixture';
import { test, expect, getBaseUrl } from '$utils/financer-page';

export const getAllCategories = async () => {
  const baseUrl = getBaseUrl();
  return (await (
    await fetch(`${baseUrl}/api/transaction-categories`)
  ).json()) as TransactionCategoryDto[];
};

export const getCategoryForAllTypes =
  async (): Promise<TransactionCategoryDto> => {
    const categories = await getAllCategories();
    const category = categories.find(
      ({ name }) => name === 'Category for all types',
    );

    if (!category) {
      throw new Error('Category for all types not found');
    }

    return category;
  };

test.describe('Transaction category analytics', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  const roundToTwoDecimals = (value: number) => Math.round(value * 100) / 100;

  test('Should return correct amounts when category has incomes and expenses', async ({
    page,
  }) => {
    const categoryForAllTypes = await getCategoryForAllTypes();

    const response = (await page.goto(
      `/api/transactions/monthly-summaries?year=2022&month=01&page=1&limit=500&parentTransactionCategory=${categoryForAllTypes.id}`,
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
    const categoryForAllTypes = await getCategoryForAllTypes();

    const response = (await page.goto(
      `/api/transaction-categories/${categoryForAllTypes.id}/summary?year=2022&month=01&page=1&limit=500`,
    )) as Response;
    expect(response.status()).toBe(200);
    const [body] = await response.json();

    expect(body.totalCount).toBe(4);
    expect(roundToTwoDecimals(body.totalAmount)).toBe(1135.55);

    expect(body.incomesCount).toBe(2);
    expect(roundToTwoDecimals(body.incomeAmount)).toBe(2271.53);

    expect(body.expensesCount).toBe(2);
    expect(roundToTwoDecimals(body.expenseAmount)).toBe(1135.98);

    expect(body.transfersCount).toBe(0);
    expect(roundToTwoDecimals(body.transferAmount)).toBe(0);
  });
});
