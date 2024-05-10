import {
  getTransactionById,
  submitTransactionCategoryForm,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit expense with category', () => {
  const ids = {
    expenseWithSingleCategory: '623de25fc839cf72d59b0dbd',
    expenseWithMultipleCategories: '623de288c839cf72d59b0dd2',
    editExpenseButton: 'edit-expense-button',
    transactionCategoriesForm: 'transaction-categories-form',
    transactionCategoriesItem: 'transaction-categories-item',
  };

  test.beforeEach(async () => {
    await applyFixture('small');
  });

  test('Edit with single category', async ({ page }) => {
    const targetTransaction = await getTransactionById(
      ids.expenseWithSingleCategory,
    );
    const transactionYear = targetTransaction.dateObj.getFullYear();
    const transactionMonth = (targetTransaction.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(ids.expenseWithSingleCategory).click();
    await page.getByTestId(ids.editExpenseButton).click();

    await page.getByRole('button', { name: 'Edit category' }).click();
    await page.waitForTimeout(100);

    const select = page.getByTestId(`${ids.transactionCategoriesForm}-select`);
    const amount = page.getByTestId(`${ids.transactionCategoriesForm}-amount`);
    const description = page.getByTestId(
      `${ids.transactionCategoriesForm}-description`,
    );

    await expect(select.locator('option:checked')).toContainText(
      'Invisible category > Sub category for all types',
    );
    await expect(amount).toHaveValue('22222');
    await expect(description).toHaveValue('dummy description');

    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      select: 'Category for all types',
      amount: '50.50',
    });

    await page.waitForTimeout(100);

    await page.getByTestId('submit').click();

    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);
    await page.getByTestId(ids.expenseWithSingleCategory).click();
    await page.getByTestId(ids.editExpenseButton).click();

    await page.getByRole('button', { name: 'Edit category' }).click();
    await page.waitForTimeout(100);

    await expect(select.locator('option:checked')).toContainText(
      'Category for all types',
    );
    await expect(amount).toHaveValue('50.5');
    await expect(description).toHaveValue('');
  });

  test('Delete one categories with multiple categories', async ({ page }) => {
    const targetTransaction = await getTransactionById(
      ids.expenseWithMultipleCategories,
    );
    const transactionYear = targetTransaction.dateObj.getFullYear();
    const transactionMonth = (targetTransaction.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(ids.expenseWithMultipleCategories).click();
    await page.getByTestId(ids.editExpenseButton).click();

    const item = page.getByTestId(ids.transactionCategoriesItem);
    const name = page.getByTestId(`${ids.transactionCategoriesItem}-name`);
    const amount = page.getByTestId(`${ids.transactionCategoriesItem}-amount`);
    const description = page.getByTestId(
      `${ids.transactionCategoriesItem}-description`,
    );

    await expect(name.first()).toContainText('Expense category');
    await expect(name.nth(1)).toContainText(
      'Invisible category > Expense sub category',
    );

    await expect(amount.first()).toContainText('3333');
    await expect(amount.nth(1)).toContainText('34564532');

    await expect(description.first()).toContainText('dummy description');
    await expect(description.nth(1)).toContainText('not so dummy description');

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    await page.waitForTimeout(100);

    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      amount: '100',
      description: 'Changed description',
    });

    await expect(item).toHaveCount(2);

    await page.getByRole('button', { name: 'Edit category' }).last().click();
    await page.waitForTimeout(100);

    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    await expect(item).toHaveCount(1);

    await page.getByTestId('submit').click();

    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);
    await page.getByTestId(ids.expenseWithMultipleCategories).click();
    await page.getByTestId(ids.editExpenseButton).click();

    await expect(item).toHaveCount(1);
    await expect(name).toHaveText('Expense category');
    await expect(amount).toHaveText('100');
    await expect(description).toHaveText('Changed description');
  });

  test('Delete all categories with multiple categories', async ({ page }) => {
    const targetTransaction = await getTransactionById(
      ids.expenseWithMultipleCategories,
    );
    const transactionYear = targetTransaction.dateObj.getFullYear();
    const transactionMonth = (targetTransaction.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(ids.expenseWithMultipleCategories).click();
    await page.getByTestId(ids.editExpenseButton).click();

    const item = page.getByTestId(ids.transactionCategoriesItem);
    await expect(item).toHaveCount(2);

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    await page.waitForTimeout(100);
    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    await page.waitForTimeout(100);

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    await page.waitForTimeout(100);
    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    await expect(item).toHaveCount(0);

    await page.getByTestId('submit').click();

    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);
    await page.getByTestId(ids.expenseWithMultipleCategories).click();
    await page.getByTestId(ids.editExpenseButton).click();

    await expect(item).toHaveCount(0);
  });
});
