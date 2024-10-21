import { submitTransactionCategoryForm } from '$utils/api-helper';
import {
  getIncomeIdWithMultipleCategories,
  getIncomeIdWithSingleCategory,
} from '$utils/entity-id-api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit income with category', () => {
  const ids = {
    editIncomeButton: 'edit-income-button',
    transactionCategoriesForm: 'transaction-categories-form',
    transactionCategoriesItem: 'transaction-categories-item',
  };

  test.beforeEach(async () => {
    await applyFixture('small');
  });

  test('Edit with single category', async ({ page }) => {
    const incomeWithSingleCategory = await getIncomeIdWithSingleCategory();

    const transactionYear = incomeWithSingleCategory.dateObj.getFullYear();
    const transactionMonth = (incomeWithSingleCategory.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(incomeWithSingleCategory.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    await page.getByRole('button', { name: 'Edit category' }).click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    const select = page.getByTestId(`${ids.transactionCategoriesForm}-select`);
    const amount = page.getByTestId(`${ids.transactionCategoriesForm}-amount`);
    const description = page.getByTestId(
      `${ids.transactionCategoriesForm}-description`,
    );

    await expect(select.locator('option:checked')).toContainText(
      'Category for all types',
    );
    await expect(amount).toHaveValue('2222');
    await expect(description).toHaveValue('dummy description');

    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      select: 'Invisible category > Sub category for all types',
      amount: '50.50',
    });

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await page.getByTestId('edit-income-form').getByTestId('submit').click();

    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);
    await page.getByTestId(incomeWithSingleCategory.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    await page.getByRole('button', { name: 'Edit category' }).click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await expect(select.locator('option:checked')).toContainText(
      'Invisible category > Sub category for all types',
    );
    await expect(amount).toHaveValue('50.5');
    await expect(description).toHaveValue('');
  });

  test('Delete one categories with multiple categories', async ({ page }) => {
    const incomeWithMultipleCategories =
      await getIncomeIdWithMultipleCategories();

    const transactionYear = incomeWithMultipleCategories.dateObj.getFullYear();
    const transactionMonth = (
      incomeWithMultipleCategories.dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(incomeWithMultipleCategories.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    const item = page.getByTestId(ids.transactionCategoriesItem);
    const name = page.getByTestId(`${ids.transactionCategoriesItem}-name`);
    const amount = page.getByTestId(`${ids.transactionCategoriesItem}-amount`);
    const description = page.getByTestId(
      `${ids.transactionCategoriesItem}-description`,
    );

    await expect(name.first()).toContainText('Income category');
    await expect(name.nth(1)).toContainText('Category for all types');

    await expect(amount.first()).toContainText('222');
    await expect(amount.nth(1)).toContainText('555');

    await expect(description.first()).toContainText('dummy description');
    await expect(description.nth(1)).toContainText('not so dummy description');

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await submitTransactionCategoryForm(ids.transactionCategoriesForm, page, {
      amount: '100',
      description: 'Changed description',
    });

    await expect(item).toHaveCount(2);

    await page.getByRole('button', { name: 'Edit category' }).last().click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    await expect(item).toHaveCount(1);

    await page.getByTestId('edit-income-form').getByTestId('submit').click();

    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);
    await page.getByTestId(incomeWithMultipleCategories.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    await expect(item).toHaveCount(1);
    await expect(name).toHaveText('Income category');
    await expect(amount).toHaveText('100');
    await expect(description).toHaveText('Changed description');
  });

  test('Delete all categories with multiple categories', async ({ page }) => {
    const incomeWithMultipleCategories =
      await getIncomeIdWithMultipleCategories();

    const transactionYear = incomeWithMultipleCategories.dateObj.getFullYear();
    const transactionMonth = (
      incomeWithMultipleCategories.dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(incomeWithMultipleCategories.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    const item = page.getByTestId(ids.transactionCategoriesItem);
    await expect(item).toHaveCount(2);

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);
    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);

    await page.getByRole('button', { name: 'Edit category' }).first().click();
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(100);
    await page.getByTestId(`${ids.transactionCategoriesForm}-delete`).click();

    await expect(item).toHaveCount(0);

    await page.getByTestId('edit-income-form').getByTestId('submit').click();

    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);
    await page.getByTestId(incomeWithMultipleCategories.id).click();
    await page.getByTestId(ids.editIncomeButton).click();

    await expect(item).toHaveCount(0);
  });
});
