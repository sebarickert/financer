import { submitTransactionCategoryForm } from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

const INCOME_NAME = 'Test income';

test.describe('Add income with category', () => {
  const ids = {
    editExpenseButton: 'edit-expense-button',
    addCategoryButton: 'add-category-button',
    transactionCategoriesForm: 'transaction-categories-form',
    transactionCategoriesItem: 'transaction-categories-item',
  };

  test.beforeEach(async ({ page }) => {
    await applyFixture('large');

    await page.goto('/');
    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('transaction-drawer');

    await drawer
      .getByTestId('transaction-type-switcher')
      .getByLabel('Expense', { exact: true })
      .focus();

    await page.keyboard.press('ArrowLeft');

    await drawer.locator('#toAccount').selectOption({ index: 1 });
    await drawer.locator('#description').fill(INCOME_NAME);
    await drawer.locator('#amount').fill('10000.50');

    await drawer.getByTestId(ids.addCategoryButton).click();
  });

  test('Add income with category', async ({ page }) => {
    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      select: 'Category for all types',
      amount: '50',
    });

    await page.getByTestId('transaction-drawer').getByTestId('submit').click();

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

    await page.getByTestId('transaction-categories-item-edit').click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await page.evaluate(() => {
      const targetElement = document.querySelector(
        `[data-testid=transaction-categories-form-select]`,
      ) as Element;

      targetElement.innerHTML = `${targetElement.innerHTML}<option value="5407b06b-0ac2-44ec-951c-466778c2cd3a">non-existing-category</option>`;
    });

    await page
      .getByTestId(`${ids.transactionCategoriesForm}-select`)
      .selectOption('non-existing-category');
    await page.getByTestId(`${ids.transactionCategoriesForm}-submit`).click();

    await page.getByTestId('transaction-drawer').getByTestId('submit').click();

    const formErrors = page.getByTestId('toast-item');
    await expect(formErrors).toContainText('Submission failed');
    await expect(formErrors).toContainText(
      'One or more categories does not exist.',
    );
  });
});
