import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction category form', () => {
  test.beforeEach(async () => {
    await applyFixture('accounts-only');
  });

  test('Should not allow set child category as parent', async ({ page }) => {
    await page.goto(
      '/settings/transaction-categories/623b58ada3deba9879422fbf/edit'
    );

    const categoryName = 'Category for all types';

    // Verify that we have correct category
    // await expect(page).toHaveSelectorValue('#name', categoryName);
    await expect(page.locator('#name')).toHaveValue(categoryName);

    const parentCategoryOptions = page
      .locator('#parent_category_id option')
      .getByText(categoryName)
      .allTextContents();

    expect(parentCategoryOptions).not.toContain(categoryName);

    await page.evaluate(() => {
      const scopedCategoryName = 'Category for all types';

      const childCategoryId = '623b6b84a3deba9879422fdd';
      const targetElement = document.querySelector('#parent_category_id');
      targetElement.innerHTML = `${targetElement.innerHTML}<option value="${childCategoryId}">${scopedCategoryName}</option>`;
    });

    await page.locator('#parent_category_id').selectOption(categoryName);

    await page.getByTestId('submit').click();

    await expect(page.getByTestId('form-errors')).toContainText(
      'There were 1 errors with your submission'
    );
    await expect(page.getByTestId('form-errors')).toContainText(
      'Parent category cannot be child category of current item.'
    );
  });
});
