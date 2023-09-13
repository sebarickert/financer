import { AccountDto, TransactionDto } from '@local/types';
import {
  getAllTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  ITransactionWithDateObject,
  getAccountFromTransactions,
  roundToTwoDecimal,
  getAllTransfers,
} from '$utils/api-helper';

import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';


test.describe('Add transfer', () => {
    test.beforeAll(async () => {
        await applyFixture('large');
    })
    
    test.beforeEach(async ({ page }) => {
        await page.goto('/statistics/transfers');
    });
    
  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = async (page: Page, amount: number, toAccountBefore: AccountDto, toAccountAfter: AccountDto, fromAccountBefore: AccountDto, fromAccountAfter: AccountDto) => {
    expect(roundToTwoDecimal(toAccountBefore.balance + amount)).toEqual(
      roundToTwoDecimal(toAccountAfter.balance)
    );
    expect(roundToTwoDecimal(fromAccountBefore.balance - amount)).toEqual(
      roundToTwoDecimal(fromAccountAfter.balance)
    );
  };

  const verifyNewTransferCreated = async (page: Page, transfersBefore: TransactionDto[], transfersAfter: TransactionDto[]) => {
    expect(transfersBefore.length + 1).toEqual(roundToTwoDecimal(transfersAfter.length));
  };

  test('Add newest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const transfersBefore = await getAllTransfers()

    const targetToAccountTransactionBefore = transactionsBefore.at(-1);
    const targetToAccountId = getAccountFromTransactions(
      targetToAccountTransactionBefore
    );

    const targetFromAccountTransactionBefore = transactionsBefore.filter(
      ({ toAccount, fromAccount }) =>
        toAccount !== targetToAccountId && fromAccount !== targetToAccountId
    )[0];

    const targetFromAccountId = getAccountFromTransactions(
      targetFromAccountTransactionBefore
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    const newTransactionDate = new Date(
      targetToAccountTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
    );

    await page.getByTestId("add-transfer").click();
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetToAccountId);
    await page.selectOption('#fromAccount', targetFromAccountId);
    await page.getByTestId("submit").click();

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const transfersAfter = await  getAllTransfers();

    await verifyAccountBalanceChange(page, newTransactionAmount, toAccountBefore, toAccountAfter, fromAccountBefore, fromAccountAfter);
    await verifyNewTransferCreated(page, transfersBefore, transfersAfter);
  });

  test('Add second newest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const transfersBefore = await getAllTransfers()

    const targetToAccountTransactionBefore = transactionsBefore.at(-1);
    const targetToAccountId = getAccountFromTransactions(
      targetToAccountTransactionBefore
    );

    const targetFromAccountTransactionBefore = transactionsBefore
      .concat()
      .reverse()
      .filter(
        ({ toAccount, fromAccount }) =>
          toAccount !== targetToAccountId &&
          fromAccount !== targetToAccountId
      )[0];

    const targetFromAccountId = getAccountFromTransactions(
      targetFromAccountTransactionBefore
    );
    const newTransactionDate = new Date(
      targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.waitForTimeout(100);

    await page.click('[data-testid="add-transfer"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetToAccountId);
    await page.selectOption('#fromAccount', targetFromAccountId);
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
      const toAccountAfter = await getAccount(targetToAccountId);
      const fromAccountAfter = await getAccount(targetFromAccountId);
      const transfersAfter = await  getAllTransfers();
    
    await verifyAccountBalanceChange(page, newTransactionAmount, toAccountBefore, toAccountAfter, fromAccountBefore, fromAccountAfter);
    await verifyNewTransferCreated(page, transfersBefore, transfersAfter);
  });

  test('Add oldest transfer', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const transfersBefore = await getAllTransfers()

    const targetToAccountTransactionBefore = transactionsBefore.at(0);
    const targetToAccountId = getAccountFromTransactions(
      targetToAccountTransactionBefore
    );

    const targetFromAccountTransactionBefore = transactionsBefore.filter(
      ({ toAccount, fromAccount }) =>
        toAccount !== targetToAccountId && fromAccount !== targetToAccountId
    )[0];

    const targetFromAccountId = getAccountFromTransactions(
      targetFromAccountTransactionBefore
    );

    const newTransactionDate = new Date(
      targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
    );

    const toAccountBefore = await getAccount(targetToAccountId);
    const fromAccountBefore = await getAccount(targetFromAccountId);

    await page.waitForTimeout(100);

    await page.click('[data-testid="add-transfer"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetToAccountId);
    await page.selectOption('#fromAccount', targetFromAccountId);
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const toAccountAfter = await getAccount(targetToAccountId);
    const fromAccountAfter = await getAccount(targetFromAccountId);
    const transfersAfter = await  getAllTransfers();

    await verifyAccountBalanceChange(page, newTransactionAmount, toAccountBefore, toAccountAfter, fromAccountBefore, fromAccountAfter);
    await verifyNewTransferCreated(page, transfersBefore, transfersAfter);
  });

  test('Check that date is correct', async ({ page }) => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    await page.waitForTimeout(500);

    await page.click('[data-testid="add-transfer"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(date));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', "Saving account 1");
    await page.selectOption('#fromAccount', "Saving account 2");
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    await page.click(`[data-testid="layout-root"] >> text=${newTransactionName}`);
    await page.click('[data-testid="edit-transfer-button"]');

    await page.waitForSelector('#date');

    const inputValue = await page.$eval('#date', (el: HTMLInputElement) => el.value);
    expect(date.toISOString()).toEqual(new Date(inputValue).toISOString());
  });
});