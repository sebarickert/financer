import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '@/utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '@/utils/applyFixture';
import { clickContextualNavigationItem } from '@/utils/common/clickContextualNavigationItem';
import { clickPopperItem } from '@/utils/common/clickPopperItem';
import { expect, test } from '@/utils/financer-page';
import { fillTransactionForm } from '@/utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '@/utils/transaction/getTransactionDetails';
import { setCategories } from '@/utils/transaction/setCategories';

test.describe('Income Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions/incomes');
  });

  test.describe('Edit Income', () => {
    test('should edit income and verify account balance and income list', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const {
        id,
        toAccount,
        amount: initialAmount,
      } = await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      await page.goto(`/transactions/incomes/${id}`);
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

      expect(updatedAmount).toEqual(newAmount);
      expect(updatedDescription).toEqual(newDescription);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const initialAndNewAmountDifference = initialAmount.minus(newAmount);

      expect(updatedAccountBalance).toEqual(
        initialAccountBalance.minus(initialAndNewAmountDifference),
      );

      await page.getByRole('link', { name: 'Transactions' }).click();
      await clickContextualNavigationItem(page, 'Incomes');
      await expect(page.getByTestId(id)).toContainText(updatedDescription);
    });

    test('should edit income account field and verify balance updates', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const { id, toAccount, amount } = await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialBalanceForPreviousAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const initialBalanceForNewAccount =
        await getAccountBalanceFromAccountListByName(page, 'Cash account');

      await page.goto(`/transactions/incomes/${id}`);
      await clickPopperItem(page, 'Edit');

      await fillTransactionForm(
        page,
        {
          toAccount: 'Cash account',
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
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const updatedBalanceForNewAccount =
        await getAccountBalanceFromAccountListByName(page, 'Cash account');

      expect(updatedBalanceForPreviousAccount).toEqual(
        initialBalanceForPreviousAccount.minus(amount.abs()),
      );

      expect(updatedBalanceForNewAccount).toEqual(
        initialBalanceForNewAccount.plus(amount.abs()),
      );
    });
  });

  test.describe('Categories', () => {
    test('should edit income with category and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 1', { exact: true })
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

    test('should edit income with multiple categories and remove one of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Previous page' }).click();

      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 2', { exact: true })
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

    test('should edit income with multiple categories and remove all of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Previous page' }).click();

      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 2', { exact: true })
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
