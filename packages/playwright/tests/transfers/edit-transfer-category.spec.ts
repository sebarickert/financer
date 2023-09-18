import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit transfer with category', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('small');
    await page.goto('/statistics/transfers');
  });

  test('Edit with single category', async ({ page }) => {
    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2a0c839cf72d59b0df2').click();
    await page.getByTestId('edit-transfer-button').click();

    const selectedOption = await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked')
      .evaluate((option) => option.textContent);

    expect(selectedOption).toContain(
      'Invisible category > Transfer sub category'
    );

    await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .selectOption('Invisible category > Sub category for all types');

    const amountInput = page.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    );
    await expect(amountInput).toHaveValue('3333');
    await amountInput.fill('50.50');

    const descriptionInput = page.getByTestId(
      'transaction-categories-form_transaction-category_description'
    );
    await expect(descriptionInput).toHaveValue('dummy description');
    await descriptionInput.fill('');

    await page.getByTestId('submit').click();

    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2a0c839cf72d59b0df2').click();
    await page.getByTestId('edit-transfer-button').click();

    const selectedOptionAfter = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked');

    await expect(selectedOptionAfter).toContainText(
      'Invisible category > Sub category for all types'
    );

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
    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2c0c839cf72d59b0e10').click();
    await page.getByTestId('edit-transfer-button').click();

    const selectedOptions = page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked');

    await expect(selectedOptions.first()).toContainText(
      'Invisible category > Sub category for all types'
    );
    await expect(selectedOptions.nth(1)).toContainText('Transfer category');

    const amountInputs = await page
      .getByTestId('transaction-categories-form_transaction-category_amount')
      .all();
    await expect(amountInputs[0]).toHaveValue('333333');
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

    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2c0c839cf72d59b0e10').click();
    await page.getByTestId('edit-transfer-button').click();

    const categoryRowsAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterEdit).toHaveCount(1);

    const selectedOptionsAfter = await page
      .getByTestId('transaction-categories-form_transaction-category_category')
      .locator('option:checked')
      .evaluateAll((options) => options.map((option) => option.textContent));

    expect(selectedOptionsAfter.at(0)).toContain(
      'Invisible category > Sub category for all types'
    );

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
    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2c0c839cf72d59b0e10').click();
    await page.getByTestId('edit-transfer-button').click();

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

    await page.goto('/statistics/transfers?date=2022-03&page=1');
    await page.getByTestId('623de2c0c839cf72d59b0e10').click();
    await page.getByTestId('edit-transfer-button').click();

    const categoryRowsAfterEdit = page.getByTestId(
      'transaction-categories-form_transaction-category_row'
    );
    await expect(categoryRowsAfterEdit).toHaveCount(0);
  });
});
