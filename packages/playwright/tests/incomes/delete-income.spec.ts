import { AccountDto, IncomeDto } from '$types/generated/financer';
import {
  getAllTransaction,
  getAccount,
  roundToTwoDecimal,
  getTransactionByIdRaw,
  ITransactionWithDateObject,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Delete income', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/incomes');
  });

  const verifyAccountBalanceChangeByTargetTransactionAmount = async (
    accountBefore: AccountDto,
    accountAfter: AccountDto,
    targetTransactionBefore: IncomeDto,
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
    targetTransactionBefore: IncomeDto,
  ) => {
    const targetTransactionAfter = await getTransactionByIdRaw(
      targetTransactionBefore.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest income', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount,
    );
    const targetTransactionBefore = incomesBefore.at(
      -1,
    ) as ITransactionWithDateObject;

    const targetTransactionId = targetTransactionBefore.id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('edit-income-button').click();

    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(
      accountBefore,
      accountAfter,
      targetTransactionBefore,
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });

  test('Delete oldest income', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount,
    );
    const targetTransactionBefore = incomesBefore[0];

    const targetTransactionId = targetTransactionBefore.id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId('edit-income-button').click();

    await page.getByTestId('delete-transaction').click();
    await page.getByTestId('delete-transaction-confirm').click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(
      accountBefore,
      accountAfter,
      targetTransactionBefore,
    );
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });
});
