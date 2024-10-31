import Decimal from 'decimal.js';

import { getAccountBalanceFromAccountListByName } from '$utils/account/getAccountBalanceFromAccountListByName';
import { clickPopperLink } from '$utils/common/clickPopperLink';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTransactionForm } from '$utils/transaction/fillTransactionForm';
import { getTransactionDetails } from '$utils/transaction/getTransactionDetails';

test.describe('Edit Transfer', () => {
  test.beforeEach(async () => {
    await applyFixture('large');
  });

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
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);
    const initialToAccountBalance =
      await getAccountBalanceFromAccountListByName(page, toAccount as string);

    await page.goto(`/statistics/transfers/${id}`);
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

    const updatedFromAccountBalance =
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);
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
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);

    const initialBalanceForNewFromAccount =
      await getAccountBalanceFromAccountListByName(page, 'Long-term SAVINGS');

    const initialBalanceForPreviousToAccount =
      await getAccountBalanceFromAccountListByName(page, toAccount as string);

    const initialBalanceForNewToAccount =
      await getAccountBalanceFromAccountListByName(page, 'Big money');

    await page.goto(`/statistics/transfers/${id}`);
    await clickPopperLink(page, 'Edit');

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
      await getAccountBalanceFromAccountListByName(page, fromAccount as string);

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
