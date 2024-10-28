import { AccountDto, ExpenseDetailsDto } from '$types/generated/financer';
import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit expense', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/expenses');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChanges = async (
    amount: number,
    accountBefore: AccountDto,
    accountAfter: AccountDto,
  ) => {
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore - amount).toEqual(balanceAfter);
  };

  const verifyTargetTransactionChanged = async (
    newName: string,
    changedAmount: number,
    transactionBefore: ITransactionWithDateObject<ExpenseDetailsDto>,
    transactionAfter: ITransactionWithDateObject<ExpenseDetailsDto>,
  ) => {
    const nameAfter = transactionAfter.description;
    const amountAfter = roundToTwoDecimal(transactionAfter.amount);

    const nameBefore = transactionBefore.description;
    const amountBefore = roundToTwoDecimal(transactionBefore.amount);

    expect(nameBefore).not.toEqual(newName);
    expect(nameAfter).toEqual(newName);
    expect(amountBefore + changedAmount).toEqual(amountAfter);
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Edit newest expense', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount,
    );
    const targetTransactionBefore = expensesBefore[expensesBefore.length - 1];

    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransactionBefore.id).click();

    await page.getByTestId('edit-expense-button').click();

    const editExpenseForm = page.getByTestId('edit-expense-form');

    await editExpenseForm.locator('#description').fill(editedTransactionName);
    await editExpenseForm.locator('#amount').fill(newAmount.toString());
    await editExpenseForm.locator('#fromAccount').selectOption(targetAccountId);

    await editExpenseForm.getByTestId('submit').click();

    await page.getByTestId('edit-expense-button').waitFor();

    const accountAfter = await getAccount(targetAccountId);
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore.id,
    );

    await verifyAccountBalanceChanges(
      amountToChangeTransaction,
      accountBefore,
      accountAfter,
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter,
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Edit oldest expense', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount,
    );
    const targetTransactionBefore = expensesBefore[0];

    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    const transactionYear = targetTransactionBefore.dateObj.getFullYear();
    const transactionMonth = (targetTransactionBefore.dateObj.getMonth() + 1)
      .toString()
      .padStart(2, '0');
    const dateQuery = `${transactionYear}-${transactionMonth}`;
    await page.goto(`/statistics/expenses?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransactionBefore.id).click();

    await page.getByTestId('edit-expense-button').click();

    const editExpenseForm = page.getByTestId('edit-expense-form');

    await editExpenseForm.locator('#description').fill(editedTransactionName);
    await editExpenseForm.locator('#amount').fill(newAmount.toString());

    await editExpenseForm.getByTestId('submit').click();

    await page.getByTestId('edit-expense-button').waitFor();

    const accountAfter = await getAccount(targetAccountId);
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore.id,
    );

    await verifyAccountBalanceChanges(
      amountToChangeTransaction,
      accountBefore,
      accountAfter,
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter,
    );
  });
});
