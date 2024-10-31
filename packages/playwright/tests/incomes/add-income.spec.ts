import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { switchTransactionType } from '$utils/transaction/switchTransactionType';

test.describe('Add Income', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test('should add new income and verify account balance and income list', async ({
    page,
  }) => {
    const transactionDescription = `dummy income transaction created by test code ${Math.random()}`;

    await page.goto('/accounts');
    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      'Credit account',
    );

    await page.getByTestId('add-transaction').click();

    await switchTransactionType(page, TransactionType.Income);

    await fillTransactionForm(page, {
      toAccount: 'Credit account',
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

    expect(updatedAccountBalance).toEqual(initialAccountBalance.plus(15.5));

    await page.goto('/statistics/incomes');
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

    await switchTransactionType(page, TransactionType.Income);

    await page
      .getByTestId('transaction-form')
      .getByRole('button', { name: 'Submit' })
      .click();

    const accountSelect = page
      .getByTestId('transaction-form')
      .getByLabel('To Account');

    const validationMessage = await accountSelect.evaluate((element) => {
      const select = element as HTMLInputElement;
      return select.validationMessage;
    });

    expect(validationMessage).toBe('Please select an item in the list.');
    await expect(page.getByTestId('transaction-drawer')).toBeVisible();
  });
});
