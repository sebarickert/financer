import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';

test.describe('Add Expense', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test('should add new expense and verify account balance and expense list', async ({
    page,
  }) => {
    const transactionDescription = `dummy expense transaction created by test code ${Math.random()}`;

    await page.goto('/accounts');
    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      'Credit account',
    );

    await page.getByTestId('add-transaction').click();

    await fillTransactionForm(page, {
      fromAccount: 'Credit account',
      amount: new Decimal(15.5),
      description: transactionDescription,
    });

    await page
      .getByTestId('transaction-form')
      .getByRole('button', { name: 'Submit' })
      .click();

    await expect(page.getByTestId('transaction-details')).toBeVisible();
    await expect(page.getByTestId('transaction-amount')).toContainText('15,50');
    await expect(page.getByTestId('transaction-description')).toContainText(
      transactionDescription,
    );

    await page.goto('/accounts');
    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      'Credit account',
    );

    expect(updatedAccountBalance).toEqual(initialAccountBalance.minus(15.5));

    await page.goto('/statistics/expenses');
    await expect(
      page
        .getByTestId('transaction-list-item')
        .getByText(transactionDescription),
    ).toBeVisible();
  });

  test('should not allow form submission with missing required fields', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByTestId('add-transaction').click();

    await page
      .getByTestId('transaction-form')
      .getByRole('button', { name: 'Submit' })
      .click();

    const accountSelect = page
      .getByTestId('transaction-form')
      .getByLabel('From Account');

    const validationMessage = await accountSelect.evaluate((element) => {
      const select = element as HTMLInputElement;
      return select.validationMessage;
    });

    await expect(validationMessage).toBe('Please select an item in the list.');
    await expect(page.getByTestId('transaction-drawer')).toBeVisible();
  });
});
