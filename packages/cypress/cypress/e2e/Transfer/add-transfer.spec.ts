import { AccountDto, TransactionDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getAccountFromTransactions,
  getAllTransfers,
} from '../apiHelpers';

describe('Add transfer', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/transfers');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const getNewTransactionName = () =>
    `new dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChange = (amount: number) => {
    cy.get<AccountDto>('@toAccountBefore').then((accountBefore) => {
      cy.get<AccountDto>('@toAccountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance + amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });
    cy.get<AccountDto>('@fromAccountBefore').then((accountBefore) => {
      cy.get<AccountDto>('@fromAccountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance - amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });
  };

  const verifyNewTransfersCreated = () =>
    cy.get<TransactionDto[]>('@transfersBefore').then((transfersBefore) => {
      cy.get<TransactionDto[]>('@transfersAfter').then((transfersAfter) => {
        expect(transfersBefore.length + 1).to.be.eq(
          roundToTwoDecimal(transfersAfter.length)
        );
      });
    });

  it('Add newest transfer', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('transfersBefore', getAllTransfers);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
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

        const newTransactionDate = new Date(
          targetToAccountTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
        );

        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-transfer').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetToAccountId);
        cy.get('#fromAccount').select(targetFromAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('transfersAfter', getAllTransfers);
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewTransfersCreated();
  });

  it('Add second latest transfer', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('transfersBefore', getAllTransfers);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
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

        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-transfer').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetToAccountId);
        cy.get('#fromAccount').select(targetFromAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('transfersAfter', getAllTransfers);
          });
      }
    );
    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewTransfersCreated();
  });

  it('Add oldest transfer', () => {
    const newTransactionName = getNewTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);
    cy.saveAsyncData('transfersBefore', getAllTransfers);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetToAccountTransactionBefore = transactionsBefore[0];
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

        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(100);

        cy.getById('add-transfer').click();
        cy.get('#description').clear();
        cy.get('#description').type(newTransactionName);
        cy.get('#date').clear();
        cy.get('#date').type(formatDate(newTransactionDate));
        cy.get('#amount').clear();
        cy.get('#amount').type(newTransactionAmountStr);
        cy.get('#toAccount').select(targetToAccountId);
        cy.get('#fromAccount').select(targetFromAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/add')
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('transfersAfter', getAllTransfers);
          });
      }
    );
    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewTransfersCreated();
  });

  it('Check that date is correct', () => {
    const newTransactionName = getNewTransactionName();
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.getById('add-transfer').click();
    cy.get('#description').clear();
    cy.get('#description').type(newTransactionName);
    cy.get('#date').clear();
    cy.get('#date').type(formatDate(date));
    cy.get('#amount').clear();
    cy.get('#amount').type(newTransactionAmountStr);
    cy.get('#toAccount').select('Saving account 1');
    cy.get('#fromAccount').select('Saving account 2');
    cy.getById('submit').click();

    cy.getById('layout-root').contains(newTransactionName).click();
    cy.getById('edit-transfer-button').click();
    cy.get('#date').then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
