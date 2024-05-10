import { submitTransactionCategoryForm } from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

const INCOME_NAME = 'Test income';

test.describe('Add income with category', () => {
  const ids = {
    accountId: '61460d8554ea082ad0256759',
    editExpenseButton: 'edit-expense-button',
    addCategoryButton: 'add-category-button',
    transactionCategoriesForm: 'transaction-categories-form',
    transactionCategoriesItem: 'transaction-categories-item',
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('large');

    await page.goto('/statistics/incomes/add');

    await page.locator('#toAccount').selectOption(ids.accountId);
    await page.locator('#description').fill(INCOME_NAME);
    await page.locator('#amount').fill('10000.50');

    await page.getByTestId(ids.addCategoryButton).click();
  });

  test('Add income with category', async ({ page }) => {
    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      select: 'Category for all types',
      amount: '50',
    });

    await page.getByTestId('submit').click();

    await expect(page).not.toHaveURL('/add');
    await page.getByText(INCOME_NAME).click();

    const categoryDetails = page.getByTestId('category-details');

    const name = categoryDetails
      .first()
      .getByTestId('category-details-item-description')
      .first();
    const amount = categoryDetails
      .first()
      .getByTestId('category-details-item-description')
      .last();

    await expect(name).toHaveText('Category for all types');
    await expect(amount).toContainText('50,00');
  });

  test('Verify selected category must exists', async ({ page }) => {
    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      amount: '50',
    });

    await page.getByRole('button', { name: 'Edit category' }).click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await page.evaluate(() => {
      const targetElement = document.querySelector(
        `[data-testid=transaction-categories-form-select]`,
      );
      targetElement.innerHTML = `${targetElement.innerHTML}<option value="123456789012345678901234">non-existing-category</option>`;
    });

    await page
      .getByTestId(`${ids.transactionCategoriesForm}-select`)
      .selectOption('non-existing-category');
    await page.getByTestId(`${ids.transactionCategoriesForm}-submit`).click();

    await page.getByTestId('submit').click();

    const formErrors = page.getByTestId('toast-item');
    await expect(formErrors).toContainText('Submission failed');
    await expect(formErrors).toContainText(
      'One or more categories does not exist.',
    );
  });
});
