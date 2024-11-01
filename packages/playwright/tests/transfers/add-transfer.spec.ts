import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';
import { switchTransactionType } from '$utils/transaction/switchTransactionType';

test.describe('Transfer Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test.describe('Add Transfer', () => {
    test('should add new transfer and verify account balances and transfer list', async ({
      page,
    }) => {
      const transactionDescription = `dummy transfer transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      const initialFromAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');
      const initialToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Saving account 2');

      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Transfer);

      await fillTransactionForm(page, {
        fromAccount: 'Credit account',
        toAccount: 'Saving account 2',
        amount: new Decimal(200.51),
        description: transactionDescription,
      });

      await page
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await expect(page.getByTestId('transaction-details')).toBeVisible();
      await expect(page.getByTestId('transaction-amount')).toContainText(
        '200,51',
      );
      await expect(page.getByTestId('transaction-description')).toContainText(
        transactionDescription,
      );

      await page.goto('/accounts');
      const updatedFromAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');
      const updatedToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Saving account 2');

      expect(updatedFromAccountBalance).toEqual(
        initialFromAccountBalance.minus(200.51),
      );
      expect(updatedToAccountBalance).toEqual(
        initialToAccountBalance.plus(200.51),
      );

      await page.goto('/statistics/transfers');
      await expect(
        page
          .getByTestId('transaction-list-item')
          .getByText(transactionDescription),
      ).toBeVisible();
    });
  });

  test.describe('Categories', () => {
    test('should add new transfer with category and verify it appears in transaction details', async ({
      page,
    }) => {
      const transactionDescription = `dummy transfer transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Transfer);

      await fillTransactionForm(page, {
        fromAccount: 'Big money',
        toAccount: 'Credit account',
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

      await expect(page).toHaveURL(/\/statistics\/transfers\//);

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

      await switchTransactionType(page, TransactionType.Transfer);

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
});
