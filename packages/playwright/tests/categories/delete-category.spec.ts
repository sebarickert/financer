import { getCategoryDataFromCategoryList } from '$utils/category/getCategoryDataFromCategoryList';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete Category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/categories');
  });

  ['Income category', 'Income sub category', 'Category for all types'].forEach(
    (categoryName) => {
      test(`should delete "${categoryName}" category and verify it is removed from the list`, async ({
        page,
      }) => {
        const initialCategories = await getCategoryDataFromCategoryList(page);

        expect(initialCategories.includes(categoryName)).toBe(true);

        await page
          .getByTestId('category-list')
          .getByRole('link', { name: categoryName, exact: true })
          .click();

        // TODO figure out how to achieve without waiting...
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(200);

        await clickPopperItem(page, 'Delete');

        await page
          .getByTestId('drawer')
          .getByRole('button', { name: 'Delete' })
          .click();

        // TODO figure out how to achieve without waiting...
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(200);

        const updatedCategories = await getCategoryDataFromCategoryList(page);

        expect(updatedCategories.includes(categoryName)).toBe(false);
      });
    },
  );
});
