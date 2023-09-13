import { AccountDto, TransactionDto } from '@local/types';
import {
  getAllTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  ITransactionWithDateObject,
  getAccountFromTransactions,
  roundToTwoDecimal,
  getAllIncomes,
} from '$utils/api-helper';

import { test, expect, Page } from '@playwright/test';
import { applyFixture } from '$utils/load-fixtures';


test.describe.serial('Add income', () => {
    test.beforeAll(async () => {
        await applyFixture('large');
    })
    
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/statistics/incomes');
    });
    
  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = async (page: Page, amount: number, accountBefore: AccountDto, accountAfter: AccountDto) => {
    expect(roundToTwoDecimal(accountBefore.balance + amount)).toEqual(
      roundToTwoDecimal(accountAfter.balance)
    );
  };

  const verifyNewIncomeCreated = async (page: Page, incomesBefore: TransactionDto[], incomesAfter: TransactionDto[]) => {
    expect(incomesBefore.length + 1).toEqual(roundToTwoDecimal(incomesAfter.length));
  };

  test('Add newest income', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const incomesBefore = await getAllIncomes()

    const targetTransactionBefore = transactionsBefore.at(-1);

    const targetAccountId = getAccountFromTransactions(targetTransactionBefore);

    const accountBefore = await getAccount(targetAccountId);

    const newTransactionDate = new Date(targetTransactionBefore.dateObj.getTime() + MINUTE_IN_MS);


    await page.getByTestId("add-income").click();
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetAccountId);
    await page.getByTestId("submit").click();

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const accountAfter = await getAccount(targetAccountId);
    const incomesAfter = await  getAllIncomes();

    await verifyAccountBalanceChange(page, newTransactionAmount, accountBefore, accountAfter);
    await verifyNewIncomeCreated(page, incomesBefore, incomesAfter);
  });

  test('Add second newest income', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const incomesBefore = await getAllIncomes()

    const targetTransactionBefore = transactionsBefore.at(-1);
    const targetAccountId = getAccountFromTransactions(targetTransactionBefore);

    const newTransactionDate = new Date(targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS);

    const accountBefore = await getAccount(targetAccountId);

    await page.waitForTimeout(100);

    await page.click('[data-testid="add-income"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetAccountId);
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const accountAfter = await getAccount(targetAccountId);
    const incomesAfter = await  getAllIncomes();
    
    await verifyAccountBalanceChange(page, newTransactionAmount, accountBefore, accountAfter);
    await verifyNewIncomeCreated(page, incomesBefore, incomesAfter);
  });

  test('Add oldest income', async ({ page }) => {
    const newTransactionName = getNewTransactionName();

    const transactionsBefore = await getAllTransaction()
    const incomesBefore = await getAllIncomes()

    const targetTransactionBefore = transactionsBefore.at(0);

    const targetAccountId = getAccountFromTransactions(targetTransactionBefore);

    const newTransactionDate = new Date(targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS);

    const accountBefore = await getAccount(targetAccountId);

    await page.waitForTimeout(100);

    await page.click('[data-testid="add-income"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(newTransactionDate));
    await page.fill('#amount', newTransactionAmountStr);
    await page.selectOption('#toAccount', targetAccountId);
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    //   cy.location('pathname').should('not.contain', '/add').then(() => {
    const accountAfter = await getAccount(targetAccountId);
    const incomesAfter = await  getAllIncomes();

    await verifyAccountBalanceChange(page, newTransactionAmount, accountBefore, accountAfter);
    await verifyNewIncomeCreated(page, incomesBefore, incomesAfter);
  });

  test('Check that date is correct', async ({ page }) => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    await page.waitForTimeout(500);

    await page.click('[data-testid="add-income"]');
    await page.fill('#description', newTransactionName);
    await page.fill('#date', formatDate(date));
    await page.fill('#amount', newTransactionAmountStr);
    await page.click('[data-testid="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    await page.click(`[data-testid="layout-root"] >> text=${newTransactionName}`);
    await page.click('[data-testid="edit-income-button"]');

    await page.waitForSelector('#date');

    const inputValue = await page.$eval('#date', (el: HTMLInputElement) => el.value);
    expect(date.toISOString()).toEqual(new Date(inputValue).toISOString());
  });
});