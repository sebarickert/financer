import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Expense Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test.describe('Add Expense', () => {
    test('should add new expense and verify account balance and expense list', async ({
      page,
    }) => {
      const transactionDescription = `dummy expense transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

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
      await expect(page.getByTestId('transaction-amount')).toContainText(
        '15,50',
      );
      await expect(page.getByTestId('transaction-description')).toContainText(
        transactionDescription,
      );

      await page.goto('/accounts');
      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      expect(updatedAccountBalance).toEqual(initialAccountBalance.minus(15.5));

      await page.goto('/statistics/expenses');
      await expect(
        page
          .getByTestId('transaction-list-item')
          .getByText(transactionDescription),
      ).toBeVisible();
    });
  });

  test.describe('Categories', () => {
    test('should add new expense with category and verify it appears in transaction details', async ({
      page,
    }) => {
      const transactionDescription = `dummy expense transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      await fillTransactionForm(page, {
        fromAccount: 'Credit account',
        amount: new Decimal(15.5),
        description: transactionDescription,
      });

      await page.getByTestId('add-category-button').click();

      await fillAndSubmitTransactionCategoryForm(page, {
        category: 'Category for all types',
        amount: new Decimal(15.5),
      });

      await expect(
        page.getByTestId('transaction-categories-item'),
      ).toContainText('Category for all types');
      await expect(
        page.getByTestId('transaction-categories-item'),
      ).toContainText('15.5 €');

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await expect(page).toHaveURL(/\/statistics\/expenses\//);

      const { categories } = await getTransactionDetails(page);

      expect(categories.length).toEqual(1);
      expect(categories[0].category).toEqual('Category for all types');
      expect(categories[0].amount).toEqual(new Decimal(15.5));
    });
  });

  test.describe('Form Validation', () => {
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

      expect(validationMessage).toBe('Please select an item in the list.');
      await expect(page.getByTestId('transaction-drawer')).toBeVisible();
    });
  });
});
