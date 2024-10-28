import {
  AccountDto,
  TransactionListItemDto,
  TransferListItemDto,
} from '$types/generated/financer';
import {
  getAllTransactions,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getAccountFromTransactionListItem,
  roundToTwoDecimal,
  getAllTransfers,
  getTransactionById,
} from '$utils/api-helper';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Add transfer', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('large');
    await page.goto('/statistics/transfers');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = async (
    amount: number,
    toAccountBefore: AccountDto,
    toAccountAfter: AccountDto,
    fromAccountBefore: AccountDto,
    fromAccountAfter: AccountDto,
  ) => {
    expect(roundToTwoDecimal(toAccountBefore.balance + amount)).toEqual(
      roundToTwoDecimal(toAccountAfter.balance),
    );
    expect(roundToTwoDecimal(fromAccountBefore.balance - amount)).toEqual(
      roundToTwoDecimal(fromAccountAfter.balance),
    );
  };

  const verifyNewTransferCreated = async (
    transfersBefore: TransactionListItemDto[],
    transfersAfter: TransactionListItemDto[],
  ) => {
    expect(transfersBefore.length + 1).toEqual(transfersAfter.length);
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Add newest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransactions();
    const transfersBefore = await getAllTransfers();

    const targetToAccountTransactionBefore = transactionsBefore.at(
      -1,
    ) as TransactionListItemDto;

    const targetToAccountId = await getAccountFromTransactionListItem(
      targetToAccountTransactionBefore,
    );

    const targetFromAccountTransactionBefore = transactionsBefore.filter(
      ({ toAccount, fromAccount }) =>
        toAccount !== targetToAccountId && fromAccount !== targetToAccountId,
    )[0];

    const targetFromAccountId = await getAccountFromTransactionListItem(
      targetFromAccountTransactionBefore,
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const newTransactionDate = new Date(
      new Date(targetToAccountTransactionBefore.date).getTime() + MINUTE_IN_MS,
    );

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');

    await drawer
      .getByTestId('transactionTypeSwitcher')
      .getByLabel('Expense', { exact: true })
      .focus();

    await page.keyboard.press('ArrowRight');

    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);

    await drawer.locator('#fromAccount').selectOption(targetFromAccountId);
    await drawer.locator('#toAccount').selectOption(targetToAccountId);

    await drawer.getByTestId('submit').click();

    await page.getByTestId('edit-transfer-button').waitFor();

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const transfersAfter = await getAllTransfers();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      toAccountBefore,
      toAccountAfter,
      fromAccountBefore,
      fromAccountAfter,
    );
    await verifyNewTransferCreated(transfersBefore, transfersAfter);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add second newest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransactions();
    const transfersBefore = await getAllTransfers();

    const targetToAccountTransactionBefore = transactionsBefore.at(
      -1,
    ) as TransactionListItemDto;
    const targetToAccountId = await getAccountFromTransactionListItem(
      targetToAccountTransactionBefore,
    );

    const targetFromAccountTransactionBefore = (
      await Promise.all(
        transactionsBefore.map(async ({ id }) => {
          try {
            const { toAccount, fromAccount } = await getTransactionById(id);
            return { id, toAccount, fromAccount };
          } catch (error) {
            console.error(`Failed to fetch transaction with id ${id}:`, error);
            return null;
          }
        }),
      )
    ).filter(
      (transaction) =>
        transaction &&
        transaction.toAccount !== targetToAccountId &&
        transaction.fromAccount !== targetToAccountId,
    )[0] as TransferListItemDto;

    const targetFromAccountId = await getAccountFromTransactionListItem(
      targetFromAccountTransactionBefore,
    );

    const newTransactionDate = new Date(
      new Date(targetToAccountTransactionBefore.date).getTime() - MINUTE_IN_MS,
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');

    await drawer
      .getByTestId('transactionTypeSwitcher')
      .getByLabel('Expense', { exact: true })
      .focus();

    await page.keyboard.press('ArrowRight');

    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);

    await drawer.locator('#fromAccount').selectOption(targetFromAccountId);
    await drawer.locator('#toAccount').selectOption(targetToAccountId);

    await drawer.getByTestId('submit').click();

    await page.getByTestId('edit-transfer-button').waitFor();

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const transfersAfter = await getAllTransfers();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      toAccountBefore,
      toAccountAfter,
      fromAccountBefore,
      fromAccountAfter,
    );
    await verifyNewTransferCreated(transfersBefore, transfersAfter);
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add oldest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransactions();
    const transfersBefore = await getAllTransfers();

    const targetToAccountTransactionBefore = transactionsBefore.at(
      0,
    ) as TransactionListItemDto;
    const targetToAccountId = await getAccountFromTransactionListItem(
      targetToAccountTransactionBefore,
    );

    const targetFromAccountTransactionBefore = (
      await Promise.all(
        transactionsBefore.map(async ({ id }) => {
          try {
            const { toAccount, fromAccount } = await getTransactionById(id);
            return { id, toAccount, fromAccount };
          } catch (error) {
            console.error(`Failed to fetch transaction with id ${id}:`, error);
            return null;
          }
        }),
      )
    ).filter(
      (transaction) =>
        transaction &&
        transaction.toAccount !== targetToAccountId &&
        transaction.fromAccount !== targetToAccountId,
    )[0] as TransferListItemDto;

    const targetFromAccountId = await getAccountFromTransactionListItem(
      targetFromAccountTransactionBefore,
    );

    const newTransactionDate = new Date(
      new Date(targetToAccountTransactionBefore.date).getTime() - MINUTE_IN_MS,
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');

    await drawer
      .getByTestId('transactionTypeSwitcher')
      .getByLabel('Expense', { exact: true })
      .focus();

    await page.keyboard.press('ArrowRight');

    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(newTransactionDate));
    await drawer.locator('#amount').fill(newTransactionAmountStr);

    await drawer.locator('#fromAccount').selectOption(targetFromAccountId);
    await drawer.locator('#toAccount').selectOption(targetToAccountId);

    await drawer.getByTestId('submit').click();

    await page.getByTestId('edit-transfer-button').waitFor();

    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const transfersAfter = await getAllTransfers();

    await verifyAccountBalanceChange(
      newTransactionAmount,
      toAccountBefore,
      toAccountAfter,
      fromAccountBefore,
      fromAccountAfter,
    );
    await verifyNewTransferCreated(transfersBefore, transfersAfter);
  });

  test('Check that date is correct', async ({ page }) => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    await page.getByTestId('add-transaction').click();

    const drawer = page.getByTestId('add-transaction-drawer');

    await drawer
      .getByTestId('transactionTypeSwitcher')
      .getByLabel('Expense', { exact: true })
      .focus();

    await page.keyboard.press('ArrowRight');

    await drawer.locator('#description').fill(newTransactionName);
    await drawer.locator('#date').fill(formatDate(date));
    await drawer.locator('#amount').fill(newTransactionAmountStr);

    await drawer.locator('#fromAccount').selectOption({ index: 1 });
    await drawer.locator('#toAccount').selectOption({ index: 2 });

    await drawer.getByTestId('submit').click();

    await page.getByText(newTransactionName).click();
    await page.getByTestId('edit-transfer-button').click();

    const inputValue = await page
      .getByTestId('edit-transfer-form')
      .locator('#date')
      .inputValue();
    expect(date.toISOString()).toEqual(new Date(inputValue).toISOString());
  });
});
