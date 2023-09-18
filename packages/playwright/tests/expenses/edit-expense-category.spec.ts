import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit expense with category', () => {
  test.beforeEach(async () => {
    await applyFixture('small');
    // await page.goto('/statistics/expenses');
  });

  test('Edit with single category', async ({ page }) => {
    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de25fc839cf72d59b0dbd').click();
    await page.getByTestId('edit-expense-button').click();

    const selectedOption = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked');

    await expect(selectedOption).toContainText(
      'Invisible category > Sub category for all types'
    );

    await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .selectOption('Category for all types');

    const amountInput = page.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    );
    await expect(amountInput).toHaveValue('22222');
    await amountInput.fill('50.50');

    const descriptionInput = page.getByTestId(
      'transaction-categories-form_transaction-category_description'
    );
    await expect(descriptionInput).toHaveValue('dummy description');
    await descriptionInput.fill('');

    await page.getByTestId('submit').click();

    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de25fc839cf72d59b0dbd').click();
    await page.getByTestId('edit-expense-button').click();

    const selectedOptionAfter = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked');
    await expect(selectedOptionAfter).toContainText('Category for all types');

    const amountInputAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    );
    await expect(amountInputAfterEdit).toHaveValue('50.5');

    const descriptionInputAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_description'
    );
    await expect(descriptionInputAfterEdit).toHaveValue('');
  });

  test('Delete one categories with multiple categories', async ({ page }) => {
    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de288c839cf72d59b0dd2').click();
    await page.getByTestId('edit-expense-button').click();

    const selectedOptions = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked');

    await expect(selectedOptions.first()).toContainText('Expense category');
    await expect(selectedOptions.nth(1)).toContainText(
      'Invisible category > Expense sub category'
    );

    const amountInputs = await page
      .getByTestId('transaction-categories-form_transaction-category_amount')
      .all();
    await expect(amountInputs[0]).toHaveValue('3333');
    await amountInputs[0].fill('100');

    const descriptionInputs = await page
      .getByTestId(
        'transaction-categories-form_transaction-category_description'
      )
      .all();
    await expect(descriptionInputs[0]).toHaveValue('dummy description');
    await expect(descriptionInputs[1]).toHaveValue('not so dummy description');
    await descriptionInputs[0].fill('Changed description');

    const categoryRows = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRows).toHaveCount(2);

    await page
      .getByTestId('transaction-categories-form_delete-button')
      .last()
      .click();
    const categoryRowsAfterDelete = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterDelete).toHaveCount(1);

    await page.getByTestId('submit').click();

    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de288c839cf72d59b0dd2').click();
    await page.getByTestId('edit-expense-button').click();

    const categoryRowsAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterEdit).toHaveCount(1);

    const selectedOptionsAFter = await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked')
      .evaluateAll((options) => options.map((option) => option.textContent));

    expect(selectedOptionsAFter.at(0)).toContain('Expense category');

    const amountInputAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    );
    await expect(amountInputAfterEdit).toHaveValue('100');

    const descriptionInputAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_description'
    );
    await expect(descriptionInputAfterEdit).toHaveValue('Changed description');
  });

  test('Delete all categories with multiple categories', async ({ page }) => {
    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de288c839cf72d59b0dd2').click();
    await page.getByTestId('edit-expense-button').click();

    const categoryRows = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRows).toHaveCount(2);

    await page
      .getByTestId('transaction-categories-form_delete-button')
      .first()
      .click();
    await page.getByTestId('transaction-categories-form_delete-button').click();

    const categoryRowsAfterDelete = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterDelete).toHaveCount(0);

    await page.getByTestId('submit').click();

    await page.goto('/statistics/expenses?date=2022-03&page=1');
    await page.getByTestId('623de288c839cf72d59b0dd2').click();
    await page.getByTestId('edit-expense-button').click();

    const categoryRowsAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterEdit).toHaveCount(0);
  });
});
