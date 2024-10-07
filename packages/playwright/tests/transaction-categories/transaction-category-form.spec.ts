import {
  getCategoryForAllTypes,
  getCategoryForAllTypesChildCategory,
} from '$utils/entity-id-api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Transaction category form', () => {
  test.beforeEach(async () => {
    await applyFixture('accounts-only');
  });

  test('Should not allow set child category as parent', async ({ page }) => {
    const [categoryForAllTypes, categoryForAllTypesChild] = await Promise.all([
      getCategoryForAllTypes(),
      getCategoryForAllTypesChildCategory(),
    ]);

    await page.goto(`/settings/categories/${categoryForAllTypes.id}/edit`);

    const categoryName = 'Category for all types';

    // Verify that we have correct category
    await expect(page.locator('#name')).toHaveValue(categoryName);

    const parentCategoryOptions = page
      .locator('#parentCategoryId option')
      .getByText(categoryName)
      .allTextContents();

    expect(parentCategoryOptions).not.toContain(categoryName);

    await page.evaluate(
      ([scopedCategoryForAllTypesChild]) => {
        const targetElement = document.querySelector(
          '#parentCategoryId',
        ) as Element;
        targetElement.innerHTML = `${targetElement.innerHTML}<option value="${scopedCategoryForAllTypesChild.id}">${scopedCategoryForAllTypesChild.name}</option>`;
      },
      [categoryForAllTypesChild],
    );

    await page.locator('#parentCategoryId').selectOption(categoryName);

    await page.getByTestId('submit').click();

    const formErrors = page.getByTestId('toast-item');
    await expect(formErrors).toContainText('Submission failed');
    await expect(formErrors).toContainText(
      'Parent category cannot be child category of current item.',
    );
  });
});
