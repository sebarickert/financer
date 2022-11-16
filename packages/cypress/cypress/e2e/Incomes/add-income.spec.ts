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
} from '../apiHelpers';

describe('Add income', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = (amount: number) =>
    cy.get<AccountDto>('@accountBefore').then((accountBefore) => {
      cy.get<AccountDto>('@accountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance + amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });

  const verifyNewIncomeCreated = () =>
    cy.get<TransactionDto[]>('@incomesBefore').then((incomesBefore) => {
      cy.get<TransactionDto[]>('@incomesAfter').then((incomesAfter) => {
        expect(incomesBefore.length + 1).to.be.eq(
          roundToTwoDecimal(incomesAfter.length)
        );
      });
    });

  it('Add newest income', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('incomesBefore', getAllIncomes);

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

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-income').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('incomesAfter', getAllIncomes);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewIncomeCreated();
  });

  it('Add second newest income', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('incomesBefore', getAllIncomes);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(-1);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newTransactionDate = new Date(
          targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-income').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('incomesAfter', getAllIncomes);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewIncomeCreated();
  });

  it('Add oldest income', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('incomesBefore', getAllIncomes);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(0);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newTransactionDate = new Date(
          targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-income').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('incomesAfter', getAllIncomes);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewIncomeCreated();
  });

  it('Check that date is correct', () => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.getById('add-income').click();
    cy.get('#description').clear();
    cy.get('#description').type(newTransactionName);
    cy.get('#date').clear();
    cy.get('#date').type(formatDate(date));
    cy.get('#amount').clear();
    cy.get('#amount').type(newTransactionAmountStr);
    cy.getById('submit').click();

    cy.getById('layout-root').contains(newTransactionName).click();
    cy.getById('edit-income-button').click();
    cy.get('#date').then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
