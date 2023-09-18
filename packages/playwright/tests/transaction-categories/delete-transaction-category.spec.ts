import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = async (targetCategoryName: string, page: Page) => {
    expect(await page.$(`[data-entity-title="${targetCategoryName}"]`)).not.toBeNull();

    await page.click(`[data-entity-title="${targetCategoryName}"]`);
    await page.getByTestId("delete-transaction-category").click();
    await page.getByTestId("delete-transaction-category_confirm-button").click();

    await page.waitForSelector('[data-testid=add-category]');

    expect(await page.$(`[data-entity-title="${targetCategoryName}"]`)).toBeNull();
  };

  test.beforeEach(async ({ page }) => {
    applyFixture('accounts-only');
    await page.goto('/profile/transaction-categories');
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