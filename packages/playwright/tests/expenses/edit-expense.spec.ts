import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { clickPopperLink } from '$utils/common/clickPopperLink';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Edit Expense', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

  test('should edit expense and verify account balance and expense list', async ({
    page,
  }) => {
    await page.goto('/statistics/expenses/?date=2022-1');

    await page.getByTestId('transaction-list-item').first().click();

    const {
      id,
      fromAccount,
      amount: initialAmount,
    } = await getTransactionDetails(page);

    await page.goto('/accounts');

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    await page.goto(`/statistics/expenses/${id}`);
    await clickPopperLink(page, 'Edit');

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

    await page.goto('/accounts');

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      fromAccount as string,
    );

    const initialAndNewAmountDifference = initialAmount.plus(newAmount);

    expect(updatedAccountBalance).toEqual(
      initialAccountBalance.minus(initialAndNewAmountDifference),
    );

    await page.goto('/statistics/expenses/?date=2022-1');
    await expect(page.getByTestId(id)).toContainText(updatedDescription);
  });

  test('should edit expense account field and verify balance updates', async ({
    page,
  }) => {
    await page.goto('/statistics/expenses/?date=2022-1');

    await page.getByTestId('transaction-list-item').first().click();

    const { id, fromAccount, amount } = await getTransactionDetails(page);

    await page.goto('/accounts');

    const initialBalanceForPreviousAccount =
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);

    const initialBalanceForNewAccount =
      await getAccountBalanceFromAccountListByName(page, 'Cash account');

    await page.goto(`/statistics/expenses/${id}`);
    await clickPopperLink(page, 'Edit');

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

    // TODO Have to go to another page and come back to get the updated balance (cache issue)
    await page.goto('/statistics/expenses/?date=2022-1');
    await page.goto('/accounts');

    const updatedBalanceForPreviousAccount =
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);

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
