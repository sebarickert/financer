import { AccountDto, TransferListItemDto } from '$types/generated/financer';
import {
  getAccount,
  roundToTwoDecimal,
  getTransactionById,
  getAllTransfers,
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
    targetTransactionBefore: TransferListItemDto,
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
    targetTransactionBefore: TransferListItemDto,
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
    targetTransactionBefore: TransferListItemDto,
  ) => {
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest transfer', async ({ page }) => {
    const transfersBefore = await getAllTransfers();

    const targetTransactionBefore = transfersBefore.at(
      -1,
    ) as TransferListItemDto;

    const targetTransactionId = targetTransactionBefore.id;
    const { fromAccount: targetFromAccountId, toAccount: targetToAccountId } =
      await getTransactionById(targetTransactionBefore.id);

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const transactionYear = new Date(
      targetTransactionBefore.date,
    ).getFullYear();
    const transactionMonth = (
      new Date(targetTransactionBefore.date).getMonth() + 1
    )
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
    const transfersBefore = await getAllTransfers();

    const targetTransactionBefore = transfersBefore[0];

    const targetTransactionId = targetTransactionBefore.id;
    const { fromAccount: targetFromAccountId, toAccount: targetToAccountId } =
      await getTransactionById(targetTransactionBefore.id);

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const transactionYear = new Date(
      targetTransactionBefore.date,
    ).getFullYear();
    const transactionMonth = (
      new Date(targetTransactionBefore.date).getMonth() + 1
    )
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
