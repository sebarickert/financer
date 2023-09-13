import { AccountDto, IncomeDto, TransactionDto } from '@local/types';
import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '$utils/api-helper';
import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Delete income', () => {
    test.beforeAll(async () => {
        await applyFixture('large');
    });

  test.beforeEach(async ({page}) => {
    await page.goto('/statistics/incomes');
  });

  const verifyAccountBalanceChangeByTargetTransactionAmount = async (accountBefore: AccountDto, accountAfter: AccountDto, targetTransactionBefore: IncomeDto) => {
    const changedAmount = roundToTwoDecimal(targetTransactionBefore.amount);
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);
    const balanceBeforeWithChangedAmount = roundToTwoDecimal(
      balanceBefore + changedAmount
    );

    expect(balanceBeforeWithChangedAmount).toBe(balanceAfter);
  };

  const verifyTargetTransactionDoesNotExistsAfter = async (targetTransactionBefore: IncomeDto) => {
    const targetTransactionAfter = await getTransactionByIdRaw(targetTransactionBefore._id);

    expect((targetTransactionAfter as any).statusCode).toBe(404);
  };

  test('Delete newest income', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount
    );
    const targetTransactionBefore = incomesBefore.at(-1);

    const targetTransactionId = targetTransactionBefore._id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    await page.goto(
      '/statistics/incomes?date=2022-01&page=1'
    );


    await page.getByTestId(targetTransactionId).click();

    await page.waitForSelector("[data-testid=income-delete-modal_open-button]");

    await page.getByTestId("income-delete-modal_open-button").click();
    await page.getByTestId("income-delete-modal_confirm-button").click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(accountBefore, accountAfter, targetTransactionBefore);
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });

  test('Delete oldest income', async ({ page }) => {
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount
    );
    const targetTransactionBefore = incomesBefore[0];

    const targetTransactionId = targetTransactionBefore._id;
    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    await page.goto(
      '/statistics/incomes?date=2021-02&page=1'
    );
    await page.getByTestId(targetTransactionId).click();

    await page.getByTestId("income-delete-modal_open-button").click();
    await page.getByTestId("income-delete-modal_confirm-button").click();

    await expect(page).not.toHaveURL(`/${targetAccountId}`);

    const accountAfter = await getAccount(targetAccountId);

    verifyAccountBalanceChangeByTargetTransactionAmount(accountBefore, accountAfter, targetTransactionBefore);
    verifyTargetTransactionDoesNotExistsAfter(targetTransactionBefore);
  });
});