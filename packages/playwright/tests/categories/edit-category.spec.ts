import { TransactionType } from '$types/generated/financer';
import { fillCategoryForm } from '$utils/category/fillCategoryForm';
import { getCategoryDetails } from '$utils/category/getCategoryDetails';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit Category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/categories');
  });

  test.describe('Edit Category Details', () => {
    test('should edit category details and verify changes are saved', async ({
      page,
    }) => {
      await page
        .getByTestId('category-list')
        .getByRole('link', { name: 'Expense category' })
        .click();

      const {
        name: initialName,
        visibility: initialVisibility,
        parentCategory: initialParentCategory,
      } = await getCategoryDetails(page);

      await clickPopperItem(page, 'Edit');

      await fillCategoryForm(page, {
        name: 'Edited Expense category',
        visibility: [TransactionType.Income],
        parentCategory: 'Income category',
      });

      await page.getByTestId('category-form').getByTestId('submit').click();

      const {
        name: updatedName,
        visibility: updatedVisibility,
        parentCategory: updatedParentCategory,
      } = await getCategoryDetails(page);

      expect(updatedName).not.toEqual(initialName);
      expect(updatedName).toEqual('Edited Expense category');
      expect(updatedVisibility).not.toEqual(initialVisibility);
      expect(updatedVisibility).toEqual([TransactionType.Income]);
      expect(updatedParentCategory).not.toEqual(initialParentCategory);
      expect(updatedParentCategory).toEqual('Income category');
    });
  });

  test.describe('Prevent Invalid Parent Category Assignment', () => {
    test('should not allow setting a child category as parent', async ({
      page,
    }) => {
      await page
        .getByTestId('category-list')
        .getByRole('link', { name: 'Invisible sub category', exact: true })
        .click();

      const { id: childCategoryId, name: childCategoryName } =
        await getCategoryDetails(page);

      await page.getByTestId('header-back-link').click();

      await page
        .getByTestId('category-list')
        .getByRole('link', { name: 'Category for all types', exact: true })
        .click();

      await clickPopperItem(page, 'Edit');

      // TODO figure out how to achieve without waiting...
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await page.waitForTimeout(200);

      await page.evaluate(
        ([scopedChildCategoryName, scopedChildCategoryId]) => {
          const targetElement = document.querySelector(
            '#parentCategoryId',
          ) as Element;
          targetElement.innerHTML = `${targetElement.innerHTML}<option value="${scopedChildCategoryId}">${scopedChildCategoryName}</option>`;
        },
        [childCategoryName, childCategoryId],
      );

      await fillCategoryForm(page, {
        parentCategory: childCategoryName,
      });

      await page.getByTestId('category-form').getByTestId('submit').click();

      const formErrors = page.getByTestId('toast-item');
      await expect(formErrors).toContainText('Submission failed');
      await expect(formErrors).toContainText(
        'Parent category cannot be child category of current item.',
      );
    });
  });
});
