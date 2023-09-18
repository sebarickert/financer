import { AccountDto, ExpenseDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete expense', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/expenses');
  });

  const verifyAccountBalanceChangeByTargetTransactionAmount = async (
    accountBefore: AccountDto,
    accountAfter: AccountDto,
    targetTransactionBefore: ExpenseDto
  ) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore + changedAmount
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyTargetTransactionDoesNotExistsAfter = async (
    targetTransactionBefore: ExpenseDto
  ) => {
    const targetTransactionAfter = await getTransactionByIdRaw(
      targetTransactionBefore._id
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest expense', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount
    );
    const targetTransactionBefore = expensesBefore.at(-1);

    const targetTransactionId = targetTransactionBefore._id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    await page.goto('/statistics/expenses?date=2022-01&page=1');
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('expense-delete-modal_open-button').click();
    await page.getByTestId('expense-delete-modal_confirm-button').click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(
      accountBefore,
      accountAfter,
      targetTransactionBefore
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });

  test('Delete oldest expense', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount
    );
    const targetTransactionBefore = expensesBefore[0];

    const targetTransactionId = targetTransactionBefore._id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    await page.goto('/statistics/expenses?date=2021-02&page=1');
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('expense-delete-modal_open-button').click();
    await page.getByTestId('expense-delete-modal_confirm-button').click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(
      accountBefore,
      accountAfter,
      targetTransactionBefore
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });
});
