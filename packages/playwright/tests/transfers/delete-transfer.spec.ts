import { AccountDto, TransferDto } from '$types/generated/financer';
import {
  getAllTransaction,
  getAccount,
  roundToTwoDecimal,
  getTransactionByIdRaw,
  ITransactionWithDateObject,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete transfer', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/transfers');
  });

  const verifyToAccountBalanceChangeByTargetTransactionAmount = async (
    accountBefore: AccountDto,
    accountAfter: AccountDto,
    targetTransactionBefore: TransferDto,
  ) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore - changedAmount,
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyFromAccountBalanceChangeByTargetTransactionAmount = async (
    accountBefore: AccountDto,
    accountAfter: AccountDto,
    targetTransactionBefore: TransferDto,
  ) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore + changedAmount,
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyTargetTransactionDoesNotExistsAfter = async (
    targetTransactionBefore: TransferDto,
  ) => {
    const targetTransactionAfter = await getTransactionByIdRaw(
      targetTransactionBefore.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest transfer', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount,
    );
    const targetTransactionBefore = transfersBefore.at(
      -1,
    ) as ITransactionWithDateObject;

    const targetTransactionId = targetTransactionBefore.id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/transfers?date=${dateQuery}&page=1`);
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('edit-transfer-button').click();

    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetTransactionId}`);

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);

    verifyToAccountBalanceChangeByTargetTransactionAmount(
      toAccountBefore,
      toAccountAfter,
      targetTransactionBefore,
    );
    verifyFromAccountBalanceChangeByTargetTransactionAmount(
      fromAccountBefore,
      fromAccountAfter,
      targetTransactionBefore,
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });

  test('Delete oldest transfer', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount,
    );
    const targetTransactionBefore = transfersBefore[0];

    const targetTransactionId = targetTransactionBefore.id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/transfers?date=${dateQuery}&page=1`);
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('edit-transfer-button').click();

    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetTransactionId}`);

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);

    verifyToAccountBalanceChangeByTargetTransactionAmount(
      toAccountBefore,
      toAccountAfter,
      targetTransactionBefore,
    );
    verifyFromAccountBalanceChangeByTargetTransactionAmount(
      fromAccountBefore,
      fromAccountAfter,
      targetTransactionBefore,
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });
});
