import { applyFixture } from '$utils/load-fixtures';
import { test, expect } from '$utils/financer-page';

test.describe('Edit income with category', () => {
  test.beforeEach(async ({ page }) => {
      await applyFixture('small');
      await page.goto('/statistics/incomes');
  });

  test('Edit with single category', async ({ page }) => {
    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de1f2c839cf72d59b0d91').click();
    await page.getByTestId('edit-income-button').click();

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const select = await page.$('[data-testid="transaction-categories-form_transaction-category_category"]')
    const selectedOption = await select.$eval('option:checked', (option) => option.textContent);
    expect(selectedOption).toContain('Category for all types');

    await page.selectOption('[data-testid="transaction-categories-form_transaction-category_category"]', 'Invisible category > Sub category for all types');

    const amountInput = await page.$('[data-testid="transaction-categories-form_transaction-category_amount"]');
    expect(await amountInput.inputValue()).toBe('2222');
    await amountInput.fill('50.50');

    const descriptionInput = await page.$('[data-testid="transaction-categories-form_transaction-category_description"]');
    expect(await descriptionInput.inputValue()).toBe('dummy description');
    await descriptionInput.fill('');

    await page.getByTestId('submit').click();

    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de1f2c839cf72d59b0d91').click();
    await page.getByTestId('edit-income-button').click();

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const selectAfter = await page.$('[data-testid="transaction-categories-form_transaction-category_category"]')
    const selectedOptionAfter = await selectAfter.$eval('option:checked', (option) => option.textContent);
    expect(selectedOptionAfter).toContain('Invisible category > Sub category for all types');

    const amountInputAfterEdit = await page.$('[data-testid="transaction-categories-form_transaction-category_amount"]');
    expect(await amountInputAfterEdit.inputValue()).toBe('50.5');

    const descriptionInputAfterEdit = await page.$('[data-testid="transaction-categories-form_transaction-category_description"]');
    expect(await descriptionInputAfterEdit.inputValue()).toBe('');
  });

  test('Delete one categories with multiple categories', async ({ page }) => {
    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de213c839cf72d59b0da6').click();
    await page.getByTestId('edit-income-button').click();

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const selectedOptions = await page.$$eval(
      '[data-testid="transaction-categories-form_transaction-category_category"] option:checked',
      (options) => options.map((option) => option.textContent)
    );

    expect(selectedOptions[0]).toContain('Income category');
    expect(selectedOptions[1]).toContain('Category for all types');

    const amountInputs = await page.$$('[data-testid="transaction-categories-form_transaction-category_amount"]');
    expect(await amountInputs[0].inputValue()).toBe('222');
    await amountInputs[0].fill('100');

    const descriptionInputs = await page.$$('[data-testid="transaction-categories-form_transaction-category_description"]');
    expect(await descriptionInputs[0].inputValue()).toBe('dummy description');
    expect(await descriptionInputs[1].inputValue()).toBe('not so dummy description');
    await descriptionInputs[0].fill('Changed description');

    const categoryRows = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRows.length).toBe(2);

    await page.getByTestId('transaction-categories-form_delete-button').last().click();
    const categoryRowsAfterDelete = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRowsAfterDelete.length).toBe(1);

    await page.getByTestId('submit').click();

    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de213c839cf72d59b0da6').click();
    await page.getByTestId('edit-income-button').click();

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const categoryRowsAfterEdit = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRowsAfterEdit.length).toBe(1);

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const selectedOptionsAFter = await page.$$eval(
      '[data-testid="transaction-categories-form_transaction-category_category"] option:checked',
      (options) => options.map((option) => option.textContent)
    );

    expect(selectedOptionsAFter.at(0)).toContain('Income category');

    const amountInputAfterEdit = await page.$('[data-testid="transaction-categories-form_transaction-category_amount"]');
    expect(await amountInputAfterEdit.inputValue()).toBe('100');

    const descriptionInputAfterEdit = await page.$('[data-testid="transaction-categories-form_transaction-category_description"]');
    expect(await descriptionInputAfterEdit.inputValue()).toBe('Changed description');
  });

  test('Delete all categories with multiple categories', async ({ page }) => {
    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de213c839cf72d59b0da6').click();
    await page.getByTestId('edit-income-button').click();

    await page.waitForSelector('[data-testid="transaction-categories-form_transaction-category_category"]');
    const categoryRows = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRows.length).toBe(2);

    await page.getByTestId('transaction-categories-form_delete-button').first().click();
    await page.getByTestId('transaction-categories-form_delete-button').click();

    const categoryRowsAfterDelete = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRowsAfterDelete.length).toBe(0);

    await page.getByTestId('submit').click();

    await page.goto('/statistics/incomes?date=2022-03&page=1');
    await page.getByTestId('623de213c839cf72d59b0da6').click();
    await page.getByTestId('edit-income-button').click();

    const categoryRowsAfterEdit = await page.$$('[data-testid="transaction-categories-form_transaction-category_row"]');
    expect(categoryRowsAfterEdit.length).toBe(0);
  });
});