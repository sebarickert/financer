import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { applyFixture } from '$utils/applyFixture';
import { clickPopperItem } from '$utils/common/clickPopperItem';
import { test, expect } from '$utils/financer-page';
import { fillAndSubmitTransactionCategoryForm } from '$utils/transaction/fillAndSubmitTransactionCategoryForm';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Income Transactions', () => {
  test.beforeEach(async () => {
    await applyFixture();
  });

  test.describe('Edit Income', () => {
    test('should edit income and verify account balance and income list', async ({
      page,
    }) => {
      await page.goto('/statistics/incomes/?date=2022-1');

      await page.getByTestId('transaction-list-item').first().click();

      const {
        id,
        toAccount,
        amount: initialAmount,
      } = await getTransactionDetails(page);

      await page.goto('/accounts');

      const initialAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      await page.goto(`/statistics/incomes/${id}`);
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

      const updatedAccountBalance =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      const initialAndNewAmountDifference = initialAmount.minus(newAmount);

      expect(updatedAccountBalance).toEqual(
        initialAccountBalance.minus(initialAndNewAmountDifference),
      );

      await page.goto('/statistics/incomes/?date=2022-1');
      await expect(page.getByTestId(id)).toContainText(updatedDescription);
    });

    test('should edit income account field and verify balance updates', async ({
      page,
    }) => {
      await page.goto('/statistics/incomes/?date=2022-1');

      await page.getByTestId('transaction-list-item').first().click();

      const { id, toAccount, amount } = await getTransactionDetails(page);

      await page.goto('/accounts');

      const initialBalanceForPreviousAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

      const initialBalanceForNewAccount =
        await getAccountBalanceFromAccountListByName(page, 'Cash account');

      await page.goto(`/statistics/incomes/${id}`);
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

      // TODO Have to go to another page and come back to get the updated balance (cache issue)
      await page.goto('/statistics/incomes/?date=2022-1');
      await page.goto('/accounts');

      const updatedBalanceForPreviousAccount =
        await getAccountBalanceFromAccountListByName(page, toAccount as string);

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
      await page.goto('/statistics/incomes/?date=2022-1');

      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 21', { exact: true })
        .click();

      const { categories: initialCategories } =
        await getTransactionDetails(page);

      await clickPopperItem(page, 'Edit');

      await page.getByRole('button', { name: 'Edit category' }).click();

      await fillAndSubmitTransactionCategoryForm(
        page,
        {
          category: 'Income category',
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

      expect(updatedCategories[0].category).toEqual('Income category');
      expect(updatedCategories[0].amount).toEqual(new Decimal(200));
    });

    test('should edit income with multiple categories and remove one of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.goto('/statistics/incomes/?date=2022-1');

      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 23', { exact: true })
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
      await page.goto('/statistics/incomes/?date=2022-1');
      await page.goto(`/statistics/incomes/${id}`);

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories?.length);
      expect(updatedCategories).not.toContain('Category for all types');
    });

    test('should edit income with multiple categories and remove all of the categories and verify it updates values in transaction details', async ({
      page,
    }) => {
      await page.goto('/statistics/incomes/?date=2022-1');

      await page
        .getByTestId('transaction-list-item')
        .getByText('Dummy INCOME 23', { exact: true })
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
      await page.goto('/statistics/incomes/?date=2022-1');
      await page.goto(`/statistics/incomes/${id}`);

      const { categories: updatedCategories } =
        await getTransactionDetails(page);

      expect(updatedCategories.length).not.toEqual(initialCategories.length);
      expect(updatedCategories).toHaveLength(0);
    });
  });
});
