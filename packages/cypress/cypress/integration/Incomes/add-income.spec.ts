import { IAccount, ITransaction } from '@local/types';

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
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  const verifyAccountBalanceChange = (amount: number) =>
    cy.get<IAccount>('@accountBefore').then((accountBefore) => {
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance + amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });

  const verifyNewIncomeCreated = () =>
    cy.get<ITransaction[]>('@incomesBefore').then((incomesBefore) => {
      cy.get<ITransaction[]>('@incomesAfter').then((incomesAfter) => {
        expect(incomesBefore.length + 1).to.be.eq(
          roundToTwoDecimal(incomesAfter.length)
        );
      });
    });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = 'new dummy transaction created by test code';

  it('Add newest income', () => {
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
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    cy.getById('add-income').click();
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
    cy.getById('edit-income-button').click();
    cy.get('#date').then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
