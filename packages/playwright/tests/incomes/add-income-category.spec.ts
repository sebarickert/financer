import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

const INCOME_NAME = 'Test income';

test.describe('Add income with category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');

    await page.goto('/statistics/incomes/add');

    await page.locator('#description').fill(INCOME_NAME);
    await page.locator('#amount').fill('10000.50');
    await page.getByTestId('add-category-button').click();
  });

  test('Add income with category', async ({ page }) => {
    await page
      .getByTestId('transaction-categories-form_transaction-category_amount')
      .fill('50');
    await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .selectOption('Category for all types');
    await page.getByTestId('submit').click();

    await expect(page).not.toHaveURL('/add');
    await page.getByText(INCOME_NAME).click();

    await expect(page.getByTestId('category_label')).toHaveText(
      'Category for all types'
    );
    await expect(page.getByTestId('category_amount')).toContainText('50,00');
  });

  test('Verify selected category must exists', async ({ page }) => {
    await page
      .getByTestId('transaction-categories-form_transaction-category_amount')
      .fill('50');

    await page.evaluate(() => {
      const targetElement = document.querySelector(
        '[data-testid=transaction-categories-form_transaction-category_category]'
      );
      targetElement.innerHTML = `${targetElement.innerHTML}<option value="123456789012345678901234">non-existing-category</option>`;
    });

    await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .selectOption('non-existing-category');
    await page.getByTestId('submit').click();

    await expect(page.getByTestId('form-errors')).toContainText(
      'There were 1 errors with your submission'
    );
    await expect(page.getByTestId('form-errors')).toContainText(
      'One or more categories does not exist.'
    );
  });
});
