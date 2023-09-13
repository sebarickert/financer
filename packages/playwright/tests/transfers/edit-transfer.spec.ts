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

test.describe.serial('Edit transfer', () => {
    test.beforeAll(async () => {
        await applyFixture('large');
    });

  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:3000/statistics/transfers');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyToAccountBalanceChanges = async (amount: number, accountBefore: AccountDto, accountAfter: AccountDto) => {

    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore + amount).toEqual(balanceAfter);
  };

  const verifyFromAccountBalanceChanges = async (amount: number, accountBefore: AccountDto, accountAfter: AccountDto) => {

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

  test('Edit newest transfer', async ({page}) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount
    );
    const targetTransactionBefore = transfersBefore[transfersBefore.length - 1];

    const targetTransactionId = targetTransactionBefore._id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;

    const toAccountBefore = await getAccount(targetToAccountId)
    const fromAccountBefore = await getAccount(targetFromAccountId)

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`http://localhost:3000/statistics/transfers?date=2022-01&page=1`);

    await page.click(`[data-testid="${targetTransactionId}"]`);

    await page.click(`[data-testid="edit-transfer-button"]`);
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#toAccount', targetToAccountId);
    await page.selectOption('#fromAccount', targetFromAccountId);
    await page.getByTestId("submit").click();

    await page.waitForSelector("[data-testid=add-transfer]");

    const toAccountAfter = await getAccount(targetToAccountId)
    const fromAccountAfter = await getAccount(targetFromAccountId)
    const targetTransactionAfter = await getTransactionById(targetTransactionId);

    await verifyToAccountBalanceChanges(amountToChangeTransaction, toAccountBefore, toAccountAfter);
    await verifyFromAccountBalanceChanges(amountToChangeTransaction, fromAccountBefore, fromAccountAfter);
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });

  test('Edit oldest transfer', async ({page}) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const transfersBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => fromAccount && toAccount
    );
    const targetTransactionBefore = transfersBefore[0];

    const targetTransactionId = targetTransactionBefore._id;
    const targetToAccountId = targetTransactionBefore.toAccount;
    const targetFromAccountId = targetTransactionBefore.fromAccount;


    const toAccountBefore = await getAccount(targetToAccountId)
    const fromAccountBefore = await getAccount(targetFromAccountId)

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`http://localhost:3000/statistics/transfers?date=2021-02&page=1`);

    await page.click(`[data-testid="${targetTransactionId}"]`);

    await page.click(`[data-testid="edit-transfer-button"]`);
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#toAccount', targetToAccountId);
    await page.selectOption('#fromAccount', targetFromAccountId);
    await page.getByTestId("submit").click();

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const toAccountAfter = await getAccount(targetToAccountId)
    const fromAccountAfter = await getAccount(targetFromAccountId)
    const targetTransactionAfter = await getTransactionById(targetTransactionId);

    await verifyToAccountBalanceChanges(amountToChangeTransaction, toAccountBefore, toAccountAfter);
    await verifyFromAccountBalanceChanges(amountToChangeTransaction, fromAccountBefore, fromAccountAfter);
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });
});