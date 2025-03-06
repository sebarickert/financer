import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '@/utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '@/utils/applyFixture';
import { clickContextualNavigationItem } from '@/utils/common/clickContextualNavigationItem';
import { clickPopperItem } from '@/utils/common/clickPopperItem';
import { expect, test } from '@/utils/financer-page';
import { fillTransactionForm } from '@/utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '@/utils/transaction/getTransactionDetails';
import { setCategories } from '@/utils/transaction/setCategories';

test.describe('Transfer Transactions', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
    await page.goto('/transactions/transfers');
  });

  test.describe('Edit Transfer', () => {
    test('should edit transfer and verify account balance and transfer list', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const {
        id,
        toAccount,
        fromAccount,
        amount: initialAmount,
      } = await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialFromAccountBalance =
        await getAccountBalanceFromAccountListByName(page, fromAccount);
      const initialToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      await page.goto(`/transactions/transfers/${id}`);
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

      const updatedFromAccountBalance =
        await getAccountBalanceFromAccountListByName(page, fromAccount);
      const updatedToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const initialAndNewAmountDifference = initialAmount.minus(newAmount);

      expect(updatedFromAccountBalance).toEqual(
        initialFromAccountBalance.plus(initialAndNewAmountDifference),
      );
      expect(updatedToAccountBalance).toEqual(
        initialToAccountBalance.minus(initialAndNewAmountDifference),
      );

      await page.getByRole('link', { name: 'Transactions' }).click();
      await clickContextualNavigationItem(page, 'Transfers');
      await expect(page.getByTestId(id)).toContainText(updatedDescription);
    });

    test('should edit transfer account fields and verify balance updates', async ({
      page,
    }) => {
      await page.getByTestId('transaction-list-item').first().click();

      const { id, toAccount, fromAccount, amount } =
        await getTransactionDetails(page);

      await page.getByRole('link', { name: 'Accounts' }).click();

      const initialBalanceForPreviousFromAccount =
        await getAccountBalanceFromAccountListByName(page, fromAccount);

      const initialBalanceForNewFromAccount =
        await getAccountBalanceFromAccountListByName(page, 'Long-term SAVINGS');

      const initialBalanceForPreviousToAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const initialBalanceForNewToAccount =
        await getAccountBalanceFromAccountListByName(page, 'Saving account 1');

      await page.goto(`/transactions/transfers/${id}`);
      await clickPopperItem(page, 'Edit');

      await fillTransactionForm(
        page,
        {
          fromAccount: 'Long-term SAVINGS',
          toAccount: 'Saving account 1',
        },
        'page',
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      await page.getByRole('link', { name: 'Accounts' }).click();

      const updatedBalanceForPreviousFromAccount =
        await getAccountBalanceFromAccountListByName(page, fromAccount);

      const updatedBalanceForNewFromAccount =
        await getAccountBalanceFromAccountListByName(page, 'Long-term SAVINGS');

      const updatedBalanceForPreviousToAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount);

      const updatedBalanceForNewToAccount =
        await getAccountBalanceFromAccountListByName(page, 'Saving account 1');

      const expectedBalanceForPreviousFromAccount =
        initialBalanceForPreviousFromAccount.plus(amount);
      const expectedBalanceForNewFromAccount =
        initialBalanceForNewFromAccount.minus(amount);
      const expectedBalanceForPreviousToAccount =
        initialBalanceForPreviousToAccount.minus(amount);
      const expectedBalanceForNewToAccount =
        initialBalanceForNewToAccount.plus(amount);

      expect(updatedBalanceForPreviousFromAccount).toEqual(
        expectedBalanceForPreviousFromAccount,
      );
      expect(updatedBalanceForNewFromAccount).toEqual(
        expectedBalanceForNewFromAccount,
      );
      expect(updatedBalanceForPreviousToAccount).toEqual(
        expectedBalanceForPreviousToAccount,
      );
      expect(updatedBalanceForNewToAccount).toEqual(
        expectedBalanceForNewToAccount,
      );
    });
  });

  test.describe('Categories', () => {
    test('should edit transfer with category and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy TRANSFER from Big money to Investment account', {
          exact: true,
        })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await setCategories(
        page,
        [{ category: 'Category for all types', amount: new Decimal(500) }],
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
      expect(updatedCategories[0].amount).toEqual(new Decimal(500));
    });

    test('should edit transfer with multiple categories and remove one of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Previous page' }).click();

      await page
        .getByTestId('transaction-list-item')
        .getByText(
          'Dummy TRANSFER from Saving account 2 to Investment account',
          {
            exact: true,
          },
        )
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

    test('should edit transfer with multiple categories and remove all of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.getByRole('link', { name: 'Previous page' }).click();

      await page
        .getByTestId('transaction-list-item')
        .getByText(
          'Dummy TRANSFER from Saving account 2 to Investment account',
          {
            exact: true,
          },
        )
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
