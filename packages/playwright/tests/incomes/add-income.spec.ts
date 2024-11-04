import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { getEmptyListErrorMessageByBrowserName } from '$utils/common/getEmptyListErrorMessageByBrowserName';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';
import { switchTransactionType } from '$utils/transaction/switchTransactionType';

test.describe('Income Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test.describe('Add Income', () => {
    test('should add new income and verify account balance and income list', async ({
      page,
    }) => {
      const transactionDescription = `dummy income transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

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
      await expect(page.getByTestId('transaction-amount')).toContainText(
        '15,50',
      );
      await expect(page.getByTestId('transaction-description')).toContainText(
        transactionDescription,
      );

      await page.goto('/accounts');
      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, 'Credit account');

      expect(updatedAccountBalance).toEqual(initialAccountBalance.plus(15.5));

      await page.goto('/statistics/incomes');
      await expect(
        page
          .getByTestId('transaction-list-item')
          .getByText(transactionDescription),
      ).toBeVisible();
    });
  });

  test.describe('Categories', () => {
    test('should add new income with category and verify it appears in transaction details', async ({
      page,
    }) => {
      const transactionDescription = `dummy income transaction created by test code ${Math.random()}`;

      await page.goto('/accounts');
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await fillTransactionForm(page, {
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

      await expect(page).toHaveURL(/\/statistics\/incomes\//);

      const { categories } = await getTransactionDetails(page);

      expect(categories.length).toEqual(1);
      expect(categories[0].category).toEqual('Category for all types');
      expect(categories[0].amount).toEqual(new Decimal(15.5));
    });

    test('should only show income-visible categories in dropdown during transaction creation', async ({
      page,
    }) => {
      await page.goto('/');
      await page.getByTestId('add-transaction').click();

      await switchTransactionType(page, TransactionType.Income);

      await fillTransactionForm(page, { amount: new Decimal(100) });
      await page.getByTestId('add-category-button').click();

      const categoryOptions = page
        .getByLabel('Category')
        .locator('option')
        .filter({ hasNotText: 'Select category' });

      await expect(categoryOptions).toHaveCount(4);
      await expect(categoryOptions.nth(0)).toHaveText('Category for all types');
      await expect(categoryOptions.nth(1)).toHaveText('Income category');
      await expect(categoryOptions.nth(2)).toHaveText(
        'Invisible category > Income sub category',
      );
      await expect(categoryOptions.nth(3)).toHaveText(
        'Invisible category > Sub category for all types',
      );
    });
  });

  test.describe('Form Validation', () => {
    test('should not allow form submission with missing required fields', async ({
      page,
      browserName,
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

      expect(validationMessage).toEqual(
        getEmptyListErrorMessageByBrowserName(browserName),
      );
      await expect(page.getByTestId('transaction-drawer')).toBeVisible();
    });
  });
});
