import { AccountDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit income', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/incomes');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChanges = async (
    amount: number,
    accountBefore: AccountDto,
    accountAfter: AccountDto
  ) => {
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore + amount).toEqual(balanceAfter);
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

  // eslint-disable-next-line playwright/expect-expect
  test('Edit newest income', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount
    );
    const targetTransactionBefore = incomesBefore[incomesBefore.length - 1];

    const targetAccountId = targetTransactionBefore.toAccount;

    const accountBefore = await getAccount(targetAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`/statistics/incomes?date=2022-01&page=1`);

    await page.getByTestId(targetTransactionBefore._id).click();

    await page.getByTestId('edit-income-button').click();
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#toAccount', targetAccountId);
    await page.getByTestId('submit').click();

    await page.getByTestId('add-income').waitFor();

    const accountAfter = await getAccount(targetAccountId);
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore._id
    );

    await verifyAccountBalanceChanges(
      amountToChangeTransaction,
      accountBefore,
      accountAfter
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Edit oldest income', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transactionsBefore = await getAllTransaction();

    const incomesBefore = transactionsBefore.filter(
      ({ fromAccount, toAccount }) => !fromAccount && toAccount
    );
    const targetTransactionBefore = incomesBefore[0];

    const targetAccountId = targetTransactionBefore.toAccount;

    const accountBefore = await getAccount(targetAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

    await page.goto(`/statistics/incomes?date=2021-02&page=1`);

    await page.getByTestId(targetTransactionBefore._id).click();

    await page.getByTestId('edit-income-button').click();
    await page.fill('#description', editedTransactionName);
    await page.fill('#amount', newAmount.toString());
    await page.selectOption('#toAccount', targetAccountId);
    await page.getByTestId('submit').click();

    await page.getByTestId('add-income').waitFor();

    const accountAfter = await getAccount(targetAccountId);
    const targetTransactionAfter = await getTransactionById(
      targetTransactionBefore._id
    );

    await verifyAccountBalanceChanges(
      amountToChangeTransaction,
      accountBefore,
      accountAfter
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter
    );
  });
});
