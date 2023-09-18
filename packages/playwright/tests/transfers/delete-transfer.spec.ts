import { AccountDto, TransferDto } from '@local/types';
import {
  getAllTransaction,
  getAccount,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '$utils/api-helper';
import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Delete transfer', () => {
  test.beforeEach(async ({page}) => {
    await applyFixture('large');
    await page.goto('/statistics/transfers');
  });

  const verifyToAccountBalanceChangeByTargetTransactionAmount = async (accountBefore: AccountDto, accountAfter: AccountDto, targetTransactionBefore: TransferDto) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore - changedAmount
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyFromAccountBalanceChangeByTargetTransactionAmount = async (accountBefore: AccountDto, accountAfter: AccountDto, targetTransactionBefore: TransferDto) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore + changedAmount
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyTargetTransactionDoesNotExistsAfter = async (targetTransactionBefore: TransferDto) => {
    const targetTransactionAfter = await getTransactionByIdRaw(targetTransactionBefore._id);

    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest transfer', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount
    );
    const targetTransactionBefore = transfersBefore.at(-1);

    const targetTransactionId = targetTransactionBefore._id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.goto(
      '/statistics/transfers?date=2022-01&page=1'
    );


    await page.getByTestId(targetTransactionId).waitFor();
    await page.getByTestId(targetTransactionId).click();

    await page.waitForSelector("[data-testid=transfer-delete-modal_open-button]");

    await page.getByTestId("transfer-delete-modal_open-button").click();
    await page.getByTestId("transfer-delete-modal_confirm-button").click();

    await expect(page).not.toHaveURL(`/${targetTransactionId}`);

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);

    verifyToAccountBalanceChangeByTargetTransactionAmount(toAccountBefore, toAccountAfter, targetTransactionBefore);
    verifyFromAccountBalanceChangeByTargetTransactionAmount(fromAccountBefore, fromAccountAfter, targetTransactionBefore);
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });

  test('Delete oldest transfer', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount
    );
    const targetTransactionBefore = transfersBefore[0];

    const targetTransactionId = targetTransactionBefore._id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.goto(
      '/statistics/transfers?date=2021-02&page=1'
    );
    await page.getByTestId(targetTransactionId).waitFor();
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId("transfer-delete-modal_open-button").click();
    await page.getByTestId("transfer-delete-modal_confirm-button").click();

    await expect(page).not.toHaveURL(`/${targetTransactionId}`);

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);

    verifyToAccountBalanceChangeByTargetTransactionAmount(toAccountBefore, toAccountAfter, targetTransactionBefore);
    verifyFromAccountBalanceChangeByTargetTransactionAmount(fromAccountBefore, fromAccountAfter, targetTransactionBefore);
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });
});