import { applyFixture } from '$utils/applyFixture';
import { getCategoryDataFromCategoryList } from '$utils/category/getCategoryDataFromCategoryList';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { expect, test } from '$utils/financer-page';

test.describe('Delete Category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/categories');
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

        await clickPopperItem(page, 'Delete');

        await page
          .getByTestId('drawer')
          .getByRole('button', { name: 'Delete' })
          .click();

        const updatedCategories = await getCategoryDataFromCategoryList(page);

        expect(updatedCategories.includes(categoryName)).toBe(false);
      });
    },
  );
});
