import { AccountDto, TransferListItemDto } from '$types/generated/financer';
import {
  getAccount,
  getTransactionById,
  roundToTwoDecimal,
  getAllTransfers,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Edit transfer', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/transfers');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyToAccountBalanceChanges = async (
    amount: number,
    accountBefore: AccountDto,
    accountAfter: AccountDto,
  ) => {
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore + amount).toEqual(balanceAfter);
  };

  const verifyFromAccountBalanceChanges = async (
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
    transactionBefore: TransferListItemDto,
    transactionAfter: TransferListItemDto,
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
  test('Edit newest transfer', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transfersBefore = await getAllTransfers();

    const targetTransactionBefore = transfersBefore[transfersBefore.length - 1];

    const targetTransactionId = targetTransactionBefore.id;
    const { fromAccount: targetFromAccountId, toAccount: targetToAccountId } =
      await getTransactionById(targetTransactionBefore.id);

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

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

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const editTransferForm = page.getByTestId('transaction-form');

    await editTransferForm.locator('#description').fill(editedTransactionName);
    await editTransferForm.locator('#amount').fill(newAmount.toString());

    await editTransferForm
      .locator('#fromAccount')
      .selectOption(targetFromAccountId);
    await editTransferForm
      .locator('#toAccount')
      .selectOption(targetToAccountId);

    await editTransferForm.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const targetTransactionAfter =
      await getTransactionById(targetTransactionId);

    await verifyToAccountBalanceChanges(
      amountToChangeTransaction,
      toAccountBefore,
      toAccountAfter,
    );
    await verifyFromAccountBalanceChanges(
      amountToChangeTransaction,
      fromAccountBefore,
      fromAccountAfter,
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter,
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Edit oldest transfer', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const transfersBefore = await getAllTransfers();

    const targetTransactionBefore = transfersBefore[0];

    const targetTransactionId = targetTransactionBefore.id;
    const { fromAccount: targetFromAccountId, toAccount: targetToAccountId } =
      await getTransactionById(targetTransactionBefore.id);

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const newAmount =
      targetTransactionBefore.amount + amountToChangeTransaction;

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

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const editTransferForm = page.getByTestId('transaction-form');

    await editTransferForm.locator('#description').fill(editedTransactionName);
    await editTransferForm.locator('#amount').fill(newAmount.toString());

    await editTransferForm.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const targetTransactionAfter =
      await getTransactionById(targetTransactionId);

    await verifyToAccountBalanceChanges(
      amountToChangeTransaction,
      toAccountBefore,
      toAccountAfter,
    );
    await verifyFromAccountBalanceChanges(
      amountToChangeTransaction,
      fromAccountBefore,
      fromAccountAfter,
    );
    await verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction,
      targetTransactionBefore,
      targetTransactionAfter,
    );
  });
});
