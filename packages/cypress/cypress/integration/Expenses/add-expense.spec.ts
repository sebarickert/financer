import { AccountDto, TransactionDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  ITransactionWithDateObject,
  getAccountFromTransactions,
  roundToTwoDecimal,
  getAllExpenses,
} from '../apiHelpers';

describe('Add expense', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/expenses');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = (amount: number) =>
    cy.get<AccountDto>('@accountBefore').then((accountBefore) => {
      cy.get<AccountDto>('@accountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance - amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });

  const verifyNewExpenseCreated = () =>
    cy.get<TransactionDto[]>('@expensesBefore').then((expensesBefore) => {
      cy.get<TransactionDto[]>('@expensesAfter').then((expensesAfter) => {
        expect(expensesBefore.length + 1).to.be.eq(
          roundToTwoDecimal(expensesAfter.length)
        );
      });
    });

  it('Add newest expense', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('expensesBefore', getAllExpenses);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(-1);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newTransactionDate = new Date(
          targetTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
        );

        cy.getById('add-expense').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#fromAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('expensesAfter', getAllExpenses);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewExpenseCreated();
  });

  it('Add second newest expense', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('expensesBefore', getAllExpenses);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(-1);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        const newTransactionDate = new Date(
          targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        cy.getById('add-expense').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#fromAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('expensesAfter', getAllExpenses);
          });
      }
    );
    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewExpenseCreated();
  });

  it('Add oldest expense', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('expensesBefore', getAllExpenses);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(0);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        const newTransactionDate = new Date(
          targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        cy.getById('add-expense').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#fromAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('expensesAfter', getAllExpenses);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewExpenseCreated();
  });

  it('Check that date is correct', () => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    cy.getById('add-expense').click();
    cy.get('#description').clear();
    cy.get('#description').type(newTransactionName);
    cy.get('#date').clear();
    cy.get('#date').type(formatDate(date));
    cy.get('#amount').clear();
    cy.get('#amount').type(newTransactionAmountStr);
    cy.getById('submit').click();

    cy.getById('transaction-stacked-list-container')
      .contains(newTransactionName)
      .click();
    cy.getById('edit-expense-button').click();
    cy.get('#date').then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
