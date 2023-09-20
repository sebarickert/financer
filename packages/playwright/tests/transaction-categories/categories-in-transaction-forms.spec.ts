import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction categories visibility in transaction forms', () => {
  test.beforeEach(async () => {
    await applyFixture('accounts-only');
  });

  const verifyIncomeCategories = async (page: Page) => {
    const options = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option');
    await expect(options).toHaveCount(4);
    await expect(options.first()).toHaveText('Category for all types');
    await expect(options.nth(1)).toHaveText('Income category');
    await expect(options.nth(2)).toHaveText(
      'Invisible category > Income sub category'
    );
    await expect(options.nth(3)).toHaveText(
      'Invisible category > Sub category for all types'
    );
  };

  const verifyExpenseCategories = async (page: Page) => {
    const options = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option');
    await expect(options).toHaveCount(4);
    await expect(options.first()).toHaveText('Category for all types');
    await expect(options.nth(1)).toHaveText('Expense category');
    await expect(options.nth(2)).toHaveText(
      'Invisible category > Expense sub category'
    );
    await expect(options.nth(3)).toHaveText(
      'Invisible category > Sub category for all types'
    );
  };

  const verifyTransferCategories = async (page: Page) => {
    const options = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option');
    await expect(options).toHaveCount(4);
    await expect(options.first()).toHaveText('Category for all types');
    await expect(options.nth(1)).toHaveText(
      'Invisible category > Sub category for all types'
    );
    await expect(options.nth(2)).toHaveText(
      'Invisible category > Transfer sub category'
    );
    await expect(options.nth(3)).toHaveText('Transfer category');
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Verify add income categories', async ({ page }) => {
    await page.goto('/statistics/incomes/add');
    await page.locator('#amount').fill('100');

    await page.getByTestId('add-category-button').click();
    await verifyIncomeCategories(page);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Verify add expense categories', async ({ page }) => {
    await page.goto('/statistics/expenses/add');
    await page.locator('#amount').fill('100');

    await page.getByTestId('add-category-button').click();
    await verifyExpenseCategories(page);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Verify add transfer categories', async ({ page }) => {
    await page.goto('/statistics/transfers/add');
    await page.locator('#amount').fill('100');

    await page.getByTestId('add-category-button').click();
    await verifyTransferCategories(page);
  });
});
