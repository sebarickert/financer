import { AccountDto, IncomeListItemDto } from '$types/generated/financer';
import {
  getAccount,
  roundToTwoDecimal,
  getTransactionById,
  getAllIncomes,
  getAccountFromTransactionListItem,
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
    targetTransactionBefore: IncomeListItemDto,
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
    targetTransactionBefore: IncomeListItemDto,
  ) => {
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore.id,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest income', async ({ page }) => {
    const incomesBefore = await getAllIncomes();

    const targetTransactionBefore = incomesBefore.at(-1) as IncomeListItemDto;

    const targetTransactionId = targetTransactionBefore.id;
    const targetAccountId = await getAccountFromTransactionListItem(
      targetTransactionBefore,
    );

    const accountBefore = await getAccount(targetAccountId);

    const transactionYear = new Date(
      targetTransactionBefore.date,
    ).getFullYear();
    const transactionMonth = (
      new Date(targetTransactionBefore.date).getMonth() + 1
    )
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
    const incomesBefore = await getAllIncomes();

    const targetTransactionBefore = incomesBefore[0];

    const targetTransactionId = targetTransactionBefore.id;
    const targetAccountId = await getAccountFromTransactionListItem(
      targetTransactionBefore,
    );

    const accountBefore = await getAccount(targetAccountId);

    const transactionYear = new Date(
      targetTransactionBefore.date,
    ).getFullYear();
    const transactionMonth = (
      new Date(targetTransactionBefore.date).getMonth() + 1
    )
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
