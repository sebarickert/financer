import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '@playwright/test';

test.describe.serial('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = async (targetCategoryName: string, page: Page) => {
    expect(await page.$(`[data-entity-title="${targetCategoryName}"]`)).not.toBeNull();

    await page.click(`[data-entity-title="${targetCategoryName}"]`);
    await page.waitForTimeout(500);
    await page.click('[data-testid="delete-transaction-category"]');
    await page.waitForTimeout(500);
    await page.click('[data-testid="delete-transaction-category_confirm-button"]');

    await page.waitForSelector('[data-testid=add-category]');

    expect(await page.$(`[data-entity-title="${targetCategoryName}"]`)).toBeNull();
  };

  test.beforeEach(async ({ page }) => {
    applyFixture('accounts-only');
    await page.goto('http://localhost:3000/profile/transaction-categories');
    await page.waitForSelector('[data-testid=add-category]');
  });

  test('Delete category without parent/childs', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Income category', page);
  });

  test('Delete category with parent', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Income sub category', page);
  });

  test('Delete category with childs', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Category for all types', page);
  });
});