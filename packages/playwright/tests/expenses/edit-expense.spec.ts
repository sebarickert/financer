import { AccountDto } from '@local/types';
import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '$utils/api-helper';
import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '@playwright/test';

test.describe.serial('Edit expense', () => {
    test.beforeAll(async () => {
        await applyFixture('large');
    });

  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:3000/statistics/expenses');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChanges = async (amount: number, accountBefore: AccountDto, accountAfter: AccountDto) => {

    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore - amount).toEqual(balanceAfter);
  };

  const verifyTargetTransactionChanged = async (
    newName: string,
    changedAmount: number,
    transactionBefore: ITransactionWithDateObject,
    transactionAfter: ITransactionWithDateObject
  ) => {

    const nameAfter = transactionAfter.description;
    const amountAfter = roundToTwoDecimal(transactionAfter.amount);

    const nameBefore = transactionBefore.description;
    const amountBefore = roundToTwoDecimal(transactionBefore.amount);

    expect(nameBefore).not.toEqual(newName);
    expect(nameAfter).toEqual(newName);
    expect(amountBefore + changedAmount).toEqual(amountAfter);
  };

  test('Edit newest expense', async ({page}) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount
    );
    const targetTransactionBefore = expensesBefore[expensesBefore.length - 1];

    const targetAccountId = targetTransactionBefore.fromAccount;

    const accountBefore = await getAccount(targetAccountId)

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`http://localhost:3000/statistics/expenses?date=2022-01&page=1`);

    await page.click(`[data-testid="${targetTransactionBefore._id}"]`);

    await page.click(`[data-testid="edit-expense-button"]`);
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#fromAccount', targetAccountId);
    await page.click(`[data-testid="submit"]`);

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const accountAfter = await getAccount(targetAccountId)
    const targetTransactionAfter = await getTransactionById(targetTransactionBefore._id);

    await verifyAccountBalanceChanges(amountToChangeTransaction, accountBefore, accountAfter);
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });

  test('Edit oldest expense', async ({page}) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const expensesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && !toAccount
    );
    const targetTransactionBefore = expensesBefore[0];

    const targetAccountId = targetTransactionBefore.fromAccount;


    const accountBefore = await getAccount(targetAccountId)

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`http://localhost:3000/statistics/expenses?date=2021-02&page=1`);

    await page.click(`[data-testid="${targetTransactionBefore._id}"]`);

    await page.click(`[data-testid="edit-expense-button"]`);
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#fromAccount', targetAccountId);
    await page.click(`[data-testid="submit"]`);

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const accountAfter = await getAccount(targetAccountId)
    const targetTransactionAfter = await getTransactionById(targetTransactionBefore._id);

    await verifyAccountBalanceChanges(amountToChangeTransaction, accountBefore, accountAfter);
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });
});