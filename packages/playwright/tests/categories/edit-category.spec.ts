import { TransactionType } from '@/types/generated/financer';
import { applyFixture } from '@/utils/applyFixture';
import { fillCategoryForm } from '@/utils/category/fillCategoryForm';
import { getCategoryDetails } from '@/utils/category/getCategoryDetails';
import { clickPopperItem } from '@/utils/common/clickPopperItem';
import { clickUserMenuItem } from '@/utils/common/clickUserMenuItem';
import { expect, test } from '@/utils/financer-page';

test.describe('Edit Category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/categories');
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

      await page
        .getByTestId('category-form')
        .locator('button[type=submit]')
        .click();

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

      await clickUserMenuItem(page, 'Categories');

      await expect(page.getByTestId('category-list').first()).toBeVisible();

      await page
        .getByTestId('category-list')
        .getByRole('link', { name: 'Category for all types', exact: true })
        .click();

      await clickPopperItem(page, 'Edit');

      await expect(page.getByTestId('category-form')).toBeVisible();

      await page.evaluate(
        ([scopedChildCategoryName, scopedChildCategoryId]) => {
          const targetElement = document.querySelector('#parentCategoryId');

          if (!targetElement) {
            throw new Error('Parent category select not found');
          }

          targetElement.innerHTML = `${targetElement.innerHTML}<option value="${scopedChildCategoryId}">${scopedChildCategoryName}</option>`;
        },
        [childCategoryName, childCategoryId],
      );

      await fillCategoryForm(page, {
        parentCategory: childCategoryName,
      });

      await page
        .getByTestId('category-form')
        .locator('button[type=submit]')
        .click();

      const formErrors = page.getByTestId('toast');
      await expect(formErrors).toContainText('Submission failed');
      await expect(formErrors).toContainText(
        'Parent category cannot be child category of current item.',
      );
    });
  });
});
