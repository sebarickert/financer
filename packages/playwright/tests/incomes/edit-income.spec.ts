import {
  AccountDto,
  ExpenseListItemDto,
  IncomeListItemDto,
  TransactionListItemDto,
  TransferListItemDto,
} from '$types/generated/financer';
import {
  getAccount,
  getTransactionById,
  roundToTwoDecimal,
  getAllIncomes,
  getAccountFromTransactionListItem,
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
    accountAfter: AccountDto,
  ) => {
    const balanceBefore = roundToTwoDecimal(accountBefore.balance);
    const balanceAfter = roundToTwoDecimal(accountAfter.balance);

    expect(balanceBefore + amount).toEqual(balanceAfter);
  };

  const verifyTargetTransactionChanged = async (
    newName: string,
    changedAmount: number,
    transactionBefore:
      | TransactionListItemDto
      | IncomeListItemDto
      | ExpenseListItemDto
      | TransferListItemDto,
    transactionAfter:
      | TransactionListItemDto
      | IncomeListItemDto
      | ExpenseListItemDto
      | TransferListItemDto,
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
    const incomesBefore = await getAllIncomes();

    const targetTransactionBefore = incomesBefore[incomesBefore.length - 1];

    const targetAccountId = await getAccountFromTransactionListItem(
      targetTransactionBefore,
    );

    const accountBefore = await getAccount(targetAccountId);

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
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransactionBefore.id).click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const editIncomeForm = page.getByTestId('edit-income-form');

    await editIncomeForm.locator('#description').fill(editedTransactionName);
    await editIncomeForm.locator('#amount').fill(newAmount.toString());
    await editIncomeForm.locator('#toAccount').selectOption(targetAccountId);

    await editIncomeForm.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

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
  test('Edit oldest income', async ({ page }) => {
    const editedTransactionName = getEditedTransactionName();
    const incomesBefore = await getAllIncomes();

    const targetTransactionBefore = incomesBefore[0];

    const targetAccountId = await getAccountFromTransactionListItem(
      targetTransactionBefore,
    );

    const accountBefore = await getAccount(targetAccountId);

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
    await page.goto(`/statistics/incomes?date=${dateQuery}&page=1`);

    await page.getByTestId(targetTransactionBefore.id).click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

    const editIncomeForm = page.getByTestId('edit-income-form');

    await editIncomeForm.locator('#description').fill(editedTransactionName);
    await editIncomeForm.locator('#amount').fill(newAmount.toString());

    await editIncomeForm.getByTestId('submit').click();

    await page.getByTestId('popper-button').click();
    await page.getByTestId('popper-container').getByText('Edit').click();

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
