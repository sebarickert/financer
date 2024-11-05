import { TransactionType } from '$types/generated/financer';
import { fillCategoryForm } from '$utils/category/fillCategoryForm';
import { getCategoryDetails } from '$utils/category/getCategoryDetails';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Add Category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/categories');
  });

  test.describe('Fixture Loading', () => {
    test('should load fixture with correct category list and item counts', async ({
      page,
    }) => {
      await expect(page.getByTestId('category-list')).toHaveCount(3);
      await expect(page.getByTestId('category-list-item')).toHaveCount(10);
    });
  });

  test.describe('Visibility Settings', () => {
    test('should add category without visibility settings and parent, and verify details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Add Category' }).click();

      await fillCategoryForm(page, {
        name: 'New Test category',
      });

      await page.getByTestId('category-form').getByTestId('submit').click();
      await page.getByRole('link', { name: 'New Test category' }).click();

      const { name, visibility, parentCategory } =
        await getCategoryDetails(page);

      expect(name).toEqual('New Test category');
      expect(visibility).toHaveLength(0);
      expect(parentCategory).toBeFalsy();
    });

    [
      [TransactionType.Income],
      [TransactionType.Expense],
      [TransactionType.Transfer],
      [TransactionType.Income, TransactionType.Expense],
      [
        TransactionType.Income,
        TransactionType.Expense,
        TransactionType.Transfer,
      ],
    ].forEach((types) => {
      test(`should add category with ${types.join(', ')} visibility and verify details`, async ({
        page,
      }) => {
        const categoryName = `New Test ${types.join(', ')} category`;

        await page.getByRole('link', { name: 'Add Category' }).click();

        await fillCategoryForm(page, {
          name: categoryName,
          visibility: types,
        });

        await page.getByTestId('category-form').getByTestId('submit').click();
        await page.getByRole('link', { name: categoryName }).click();

        const { name, visibility } = await getCategoryDetails(page);

        expect(name).toEqual(categoryName);
        expect(visibility).toEqual(types);
      });
    });
  });

  test.describe('Parent Category Settings', () => {
    test('should add category with parent and verify details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Add Category' }).click();

      await fillCategoryForm(page, {
        name: 'New Test category with parent',
        parentCategory: 'Category for all types',
      });

      await page.getByTestId('category-form').getByTestId('submit').click();
      await page
        .getByRole('link', { name: 'New Test category with parent' })
        .click();

      const { name, parentCategory } = await getCategoryDetails(page);

      expect(name).toEqual('New Test category with parent');
      expect(parentCategory).toEqual('Category for all types');
    });

    test('should add category without visibility settings and with parent, and verify details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Add Category' }).click();

      await fillCategoryForm(page, {
        name: 'New Test category with parent and without visibility',
        parentCategory: 'Category for all types',
      });

      await page.getByTestId('category-form').getByTestId('submit').click();
      await page
        .getByRole('link', {
          name: 'New Test category with parent and without visibility',
        })
        .click();

      const { name, visibility, parentCategory } =
        await getCategoryDetails(page);

      expect(name).toEqual(
        'New Test category with parent and without visibility',
      );
      expect(visibility).toHaveLength(0);
      expect(parentCategory).toEqual('Category for all types');
    });
  });
});
