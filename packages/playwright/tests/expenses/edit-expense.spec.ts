import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { clickContextualNavigationItem } from '$utils/common/clickContextualNavigationItem';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { expect, test } from '$utils/financer-page';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';
import { setCategories } from '$utils/transaction/setCategories';

test.describe('Expense Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions/expenses');
  });

  test.describe('Edit Expense', () => {
    test('should edit expense and verify account balance and expense list', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const {
        id,
        fromAccount,
        amount: initialAmount,
      } = await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, fromAccount!);

      await page.goto(`/transactions/expenses/${id}`);
      await clickPopperItem(page, 'Edit');

      const newAmount = new Decimal(249.99);
      const newDescription = 'edited dummy transaction created by test code';

      await fillTransactionForm(
        page,
        {
          amount: newAmount,
          description: newDescription,
        },
        'page',
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const { amount: updatedAmount, description: updatedDescription } =
        await getTransactionDetails(page);

      expect(updatedAmount).toEqual(newAmount.negated());
      expect(updatedDescription).toEqual(newDescription);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, fromAccount!);

      const initialAndNewAmountDifference = initialAmount.plus(newAmount);

      expect(updatedAccountBalance).toEqual(
        initialAccountBalance.minus(initialAndNewAmountDifference),
      );

      await page.getByRole('link', { name: 'Transactions' }).click();
      await clickContextualNavigationItem(page, 'Expenses');
      await expect(page.getByTestId(id)).toContainText(updatedDescription);
    });

    test('should edit expense account field and verify balance updates', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const { id, fromAccount, amount } = await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialBalanceForPreviousAccount =
        await getAccountBalanceFromAccountListByName(page, fromAccount!);

      const initialBalanceForNewAccount =
        await getAccountBalanceFromAccountListByName(page, 'Cash account');

      await page.goto(`/transactions/expenses/${id}`);
      await clickPopperItem(page, 'Edit');

      await fillTransactionForm(
        page,
        {
          fromAccount: 'Cash account',
        },
        'page',
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await page.getByRole('link', { name: 'Accounts' }).click();

      const updatedBalanceForPreviousAccount =
        await getAccountBalanceFromAccountListByName(page, fromAccount!);

      const updatedBalanceForNewAccount =
        await getAccountBalanceFromAccountListByName(page, 'Cash account');

      expect(updatedBalanceForPreviousAccount).toEqual(
        initialBalanceForPreviousAccount.plus(amount.abs()),
      );

      expect(updatedBalanceForNewAccount).toEqual(
        initialBalanceForNewAccount.minus(amount.abs()),
      );
    });
  });

  test.describe('Categories', () => {
    test('should edit expense with category and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy EXPENSE 1', { exact: true })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await setCategories(
        page,
        [{ category: 'Category for all types', amount: new Decimal(200) }],
        'page',
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories[0].category).not.toEqual(
        initialCategories[0].category,
      );
      expect(updatedCategories[0].amount).not.toEqual(
        initialCategories[0].amount,
      );

      expect(updatedCategories[0].category).toEqual('Category for all types');
      expect(updatedCategories[0].amount).toEqual(new Decimal(200));
    });

    test('should edit expense with multiple categories and remove one of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy EXPENSE 2', { exact: true })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        3,
      );

      await page.getByTestId('remove-category').first().click();

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        2,
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories.length);
      expect(updatedCategories).not.toContain('Category for all types');
    });

    test('should edit expense with multiple categories and remove all of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy EXPENSE 2', { exact: true })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        3,
      );

      await page.getByTestId('remove-category').first().click();
      await page.getByTestId('remove-category').first().click();
      await page.getByTestId('remove-category').first().click();

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        0,
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories.length);
      expect(updatedCategories).toHaveLength(0);
    });
  });
});
