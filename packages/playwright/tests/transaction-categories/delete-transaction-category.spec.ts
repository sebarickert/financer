import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = async (
    targetCategoryName: string,
    page: Page,
  ) => {
    const category = page.getByRole('link', {
      name: targetCategoryName,
      exact: true,
    });

    await expect(category).toHaveCount(1);

    await category.click();

    await page.getByTestId('edit-category').click();

    await page.getByTestId('delete-category').click();
    await page.getByTestId('delete-category-confirm').click();

    await expect(category).toHaveCount(0);
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/categories');
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
