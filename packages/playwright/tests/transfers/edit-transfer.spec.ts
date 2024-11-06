import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Transfer Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test.describe('Edit Transfer', () => {
    test('should edit transfer and verify account balance and transfer list', async ({
      page,
    }) => {
      await page.goto('/statistics/transfers/?date=2022-1');

      await page.getByTestId('transaction-list-item').first().click();

      const {
        id,
        toAccount,
        fromAccount,
        amount: initialAmount,
      } = await getTransactionDetails(page);

      await page.goto('/accounts');

      const initialFromAccountBalance =
        await getAccountBalanceFromAccountListByName(
          page,
          fromAccount as string,
        );
      const initialToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      await page.goto(`/statistics/transfers/${id}`);
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

      await page.goto('/accounts');

      const updatedFromAccountBalance =
        await getAccountBalanceFromAccountListByName(
          page,
          fromAccount as string,
        );
      const updatedToAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      const initialAndNewAmountDifference = initialAmount.minus(newAmount);

      expect(updatedFromAccountBalance).toEqual(
        initialFromAccountBalance.plus(initialAndNewAmountDifference),
      );
      expect(updatedToAccountBalance).toEqual(
        initialToAccountBalance.minus(initialAndNewAmountDifference),
      );

      await page.goto('/statistics/transfers/?date=2022-1');
      await expect(page.getByTestId(id)).toContainText(updatedDescription);
    });

    test('should edit transfer account fields and verify balance updates', async ({
      page,
    }) => {
      await page.goto('/statistics/transfers/?date=2022-1');

      await page.getByTestId('transaction-list-item').first().click();

      const { id, toAccount, fromAccount, amount } =
        await getTransactionDetails(page);

      await page.goto('/accounts');

      const initialBalanceForPreviousFromAccount =
        await getAccountBalanceFromAccountListByName(
          page,
          fromAccount as string,
        );

      const initialBalanceForNewFromAccount =
        await getAccountBalanceFromAccountListByName(page, 'Long-term SAVINGS');

      const initialBalanceForPreviousToAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      const initialBalanceForNewToAccount =
        await getAccountBalanceFromAccountListByName(page, 'Big money');

      await page.goto(`/statistics/transfers/${id}`);
      await clickPopperItem(page, 'Edit');

      await fillTransactionForm(
        page,
        {
          fromAccount: 'Long-term SAVINGS',
          toAccount: 'Big money',
        },
        'page',
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      // TODO Have to go to another page and come back to get the updated balance (cache issue)
      await page.goto('/statistics/transfers/?date=2022-1');
      await page.goto('/accounts');

      const updatedBalanceForPreviousFromAccount =
        await getAccountBalanceFromAccountListByName(
          page,
          fromAccount as string,
        );

      const updatedBalanceForNewFromAccount =
        await getAccountBalanceFromAccountListByName(page, 'Long-term SAVINGS');

      const updatedBalanceForPreviousToAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      const updatedBalanceForNewToAccount =
        await getAccountBalanceFromAccountListByName(page, 'Big money');

      // Verify that the balance for the previous "from" account has been updated correctly
      expect(updatedBalanceForPreviousFromAccount).toEqual(
        initialBalanceForPreviousFromAccount.plus(amount),
      );

      // Verify that the balance for the previous "to" account has been updated correctly
      expect(updatedBalanceForPreviousToAccount).toEqual(
        initialBalanceForPreviousToAccount.minus(amount),
      );

      // Verify that the balance for the new "from" account has been updated correctly
      expect(updatedBalanceForNewFromAccount).toEqual(
        initialBalanceForNewFromAccount.minus(amount),
      );

      // Verify that the balance for the new "to" account has been updated correctly
      expect(updatedBalanceForNewToAccount).toEqual(
        initialBalanceForNewToAccount.plus(amount),
      );
    });
  });

  test.describe('Categories', () => {
    test('should edit transfer with category and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.goto('/statistics/transfers/?date=2022-3');

      await page
        .getByTestId('transaction-list-item')
        .getByText('TRANSFER WITH CATEGORY', { exact: true })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await page.getByRole('button', { name: 'Edit category' }).click();

      await fillAndSubmitTransactionCategoryForm(
        page,
        {
          category: 'Transfer category',
          amount: new Decimal(200),
        },
        true,
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

      expect(updatedCategories[0].category).toEqual('Transfer category');
      expect(updatedCategories[0].amount).toEqual(new Decimal(200));
    });

    test('should edit transfer with multiple categories and remove one of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.goto('/statistics/transfers/?date=2022-3');

      await page
        .getByTestId('transaction-list-item')
        .getByText('TRANSFER WITH MULTIPLE CATEGORIES', { exact: true })
        .click();

      const { id, categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        2,
      );

      await page.getByRole('button', { name: 'Edit category' }).first().click();

      await page
        .getByTestId('drawer')
        .getByTestId('transaction-categories-form')
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        1,
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      // TODO Have to go to another page and come back to get the updated data (cache issue)
      await page.goto('/statistics/transfers/?date=2022-3');
      await page.goto(`/statistics/transfers/${id}`);

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories?.length);
      expect(updatedCategories).not.toContain('Category for all types');
    });

    test('should edit transfer with multiple categories and remove all of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.goto('/statistics/transfers/?date=2022-3');

      await page
        .getByTestId('transaction-list-item')
        .getByText('TRANSFER WITH MULTIPLE CATEGORIES', { exact: true })
        .click();

      const { id, categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        2,
      );

      await page.getByRole('button', { name: 'Edit category' }).first().click();

      await page
        .getByTestId('drawer')
        .getByTestId('transaction-categories-form')
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

      await page.getByRole('button', { name: 'Edit category' }).first().click();

      await page
        .getByTestId('drawer')
        .getByTestId('transaction-categories-form')
        .getByRole('button', { name: 'Delete', exact: true })
        .click();

      await expect(page.getByTestId('transaction-categories-item')).toHaveCount(
        0,
      );

      await page
        .getByTestId('layout-root')
        .getByTestId('transaction-form')
        .getByRole('button', { name: 'Submit' })
        .click();

      // TODO Have to go to another page and come back to get the updated data (cache issue)
      await page.goto('/statistics/transfers/?date=2022-1');
      await page.goto(`/statistics/transfers/${id}`);

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories.length);
      expect(updatedCategories).toHaveLength(0);
    });
  });
});
