import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Transaction categories visibility in transaction forms', () => {
  test.beforeEach(async ({ page }) => {
    applyFixture('accounts-only')
  });

  const verifyIncomeCategories = async (page: Page) => {
    const options = await page.locator('[data-testid="transaction-categories-form_transaction-category_category"] option').all();
    expect(options.length).toBe(4);
    expect(await options[0].innerText()).toBe('Category for all types');
    expect(await options[1].innerText()).toBe('Income category');
    expect(await options[2].innerText()).toBe('Invisible category > Income sub category');
    expect(await options[3].innerText()).toBe('Invisible category > Sub category for all types');
  };

  const verifyExpenseCategories = async (page: Page) => {
    const options = await page.locator('[data-testid="transaction-categories-form_transaction-category_category"] option').all();
    expect(options.length).toBe(4);
    expect(await options[0].innerText()).toBe('Category for all types');
    expect(await options[1].innerText()).toBe('Expense category');
    expect(await options[2].innerText()).toBe('Invisible category > Expense sub category');
    expect(await options[3].innerText()).toBe('Invisible category > Sub category for all types');
  };

  const verifyTransferCategories = async (page: Page) => {
    const options = await page.locator('[data-testid="transaction-categories-form_transaction-category_category"] option').all();
    expect(options.length).toBe(4);
    expect(await options[0].innerText()).toBe('Category for all types');
    expect(await options[1].innerText()).toBe('Invisible category > Sub category for all types');
    expect(await options[2].innerText()).toBe('Invisible category > Transfer sub category');
    expect(await options[3].innerText()).toBe('Transfer category');
  };

  test('Verify add income categories', async ({ page }) => {
    await page.goto('/statistics/incomes/add');
    await page.fill('#amount', '100');

    await page.click('[data-testid="add-category-button"]');
    await verifyIncomeCategories(page);
  });

  test('Verify add expense categories', async ({ page }) => {
    await page.goto('/statistics/expenses/add');
    await page.fill('#amount', '100');

    await page.click('[data-testid="add-category-button"]');
    await verifyExpenseCategories(page);
  });

  test('Verify add transfer categories', async ({ page }) => {
    await page.goto('/statistics/transfers/add');
    await page.fill('#amount', '100');

    await page.click('[data-testid="add-category-button"]');
    await verifyTransferCategories(page);
  });
});