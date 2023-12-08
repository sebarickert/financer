import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = async (
    targetCategoryName: string,
    page: Page
  ) => {
    await expect(
      page.locator(`[data-entity-title="${targetCategoryName}"]`)
    ).toHaveCount(1);

    await page.click(`[data-entity-title="${targetCategoryName}"]`);
    await page.getByTestId('delete-transaction-category').click();
    await page
      .getByTestId('delete-transaction-category_confirm-button')
      .click();

    await expect(
      page.locator(`[data-entity-title="${targetCategoryName}"]`)
    ).toHaveCount(0);
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/transaction-categories');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Delete category without parent/childs', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Income category', page);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Delete category with parent', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Income sub category', page);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Delete category with childs', async ({ page }) => {
    await deleteAndVerifyTransactionCategory('Category for all types', page);
  });
});
