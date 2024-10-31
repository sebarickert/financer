import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { clickPopperLink } from '$utils/common/clickPopperLink';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Edit Income', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

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

    const initialAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      toAccount as string,
    );

    await page.goto(`/statistics/incomes/${id}`);
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

    expect(updatedAmount).toEqual(newAmount);
    expect(updatedDescription).toEqual(newDescription);

    await page.goto('/accounts');

    const updatedAccountBalance = await getAccountBalanceFromAccountListByName(
      page,
      toAccount as string,
    );

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
    await clickPopperLink(page, 'Edit');

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
