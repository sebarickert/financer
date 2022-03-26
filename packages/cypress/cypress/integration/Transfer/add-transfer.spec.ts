import { IAccount, ITransaction } from '@local/types';

import {
  getAllUserTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getAccountFromTransactions,
  getAccountBalanceFromTransactionByAccountId,
} from '../apiHelpers';

describe('Add transfer', () => {
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/transfers');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = 'new dummy transaction created by test code';

  const verifyAccountBalanceChange = (amount: number) => {
    cy.get<IAccount>('@toAccountBefore').then((accountBefore) => {
      cy.get<IAccount>('@toAccountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance + amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });
    cy.get<IAccount>('@fromAccountBefore').then((accountBefore) => {
      cy.get<IAccount>('@fromAccountAfter').then((accountAfter) => {
        expect(roundToTwoDecimal(accountBefore.balance - amount)).to.be.eq(
          roundToTwoDecimal(accountAfter.balance)
        );
      });
    });
  };

  const verifyTargetTransactionBalance = (amount: number) =>
    cy.get<IAccount>('@toAccountBefore').then(({ _id: accountId }) => {
      cy.get<ITransaction>('@targetToAccountTransactionBefore').then(
        (targetTransactionBefore) => {
          cy.get<ITransaction>('@targetToAccountTransactionAfter').then(
            (targetTransactionAfter) => {
              const targetTransactionBeforeBalance =
                getAccountBalanceFromTransactionByAccountId(
                  targetTransactionBefore,
                  accountId
                );
              const targetTransactionAfterBalance =
                getAccountBalanceFromTransactionByAccountId(
                  targetTransactionAfter,
                  accountId
                );

              expect(targetTransactionBeforeBalance + amount).to.be.eq(
                targetTransactionAfterBalance
              );
            }
          );
        }
      );
    });

  const verifyNewTransactionBalance = (positionInTransactions: number) => {
    cy.get<ITransaction[]>('@transactionsAfter').then((transactionsAfter) => {
      cy.get<number>('@expectedToAccountBalance').then(
        (expectedToAccountBalance) => {
          cy.get<number>('@expectedFromAccountBalance').then(
            (expectedFromAccountBalance) => {
              const newTransaction = transactionsAfter.at(
                positionInTransactions
              );

              const newTransactionToAccountBalance = roundToTwoDecimal(
                newTransaction.toAccountBalance
              );
              const newTransactionFromAccountBalance = roundToTwoDecimal(
                newTransaction.fromAccountBalance
              );
              const roundedExpectedToAccountBalance = roundToTwoDecimal(
                expectedToAccountBalance
              );
              const roundedExpectedFromAccountBalance = roundToTwoDecimal(
                expectedFromAccountBalance
              );

              expect(newTransactionToAccountBalance).to.be.eq(
                roundedExpectedToAccountBalance
              );

              expect(newTransactionFromAccountBalance).to.be.eq(
                roundedExpectedFromAccountBalance
              );
            }
          );
        }
      );
    });
  };

  it('Add newest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

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

        cy.saveData(
          'targetToAccountTransactionBefore',
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );
        cy.get<IAccount>('@toAccountBefore').then((accountBefore) =>
          cy.saveData('expectedToAccountBalance', accountBefore.balance)
        );
        cy.get<IAccount>('@fromAccountBefore').then((accountBefore) =>
          cy.saveData('expectedFromAccountBalance', accountBefore.balance)
        );

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
            cy.saveAsyncData('transactionsAfter', getAllUserTransaction);
            cy.saveAsyncData('targetToAccountTransactionAfter', () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyTargetTransactionBalance(0);
    verifyNewTransactionBalance(-1);
  });

  it('Add second latest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

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

        cy.saveData(
          'targetToAccountTransactionBefore',
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );
        cy.saveData(
          'expectedToAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetToAccountTransactionBefore,
            targetToAccountId
          )
        );
        cy.saveData(
          'expectedFromAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetFromAccountTransactionBefore,
            targetFromAccountId
          ) - targetFromAccountTransactionBefore.amount
        );

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
            cy.saveAsyncData('transactionsAfter', getAllUserTransaction);
            cy.saveAsyncData('targetToAccountTransactionAfter', () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );
    verifyAccountBalanceChange(newTransactionAmount);
    verifyTargetTransactionBalance(newTransactionAmount);
    verifyNewTransactionBalance(-2);
  });

  it('Add oldest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

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

        cy.saveData(
          'targetToAccountTransactionBefore',
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );
        cy.saveData(
          'expectedToAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetToAccountTransactionBefore,
            targetToAccountId
          )
        );
        cy.saveData(
          'expectedFromAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetFromAccountTransactionBefore,
            targetFromAccountId
          )
        );

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
            cy.saveAsyncData('transactionsAfter', getAllUserTransaction);
            cy.saveAsyncData('targetToAccountTransactionAfter', () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );
    verifyAccountBalanceChange(newTransactionAmount);
    verifyTargetTransactionBalance(newTransactionAmount);
    verifyNewTransactionBalance(0);
  });

  it('Check that date is correct', () => {
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

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

    cy.getById('transaction-stacked-list-container')
      .contains(newTransactionName)
      .click();
    cy.getById('edit-transfer-button').click();
    cy.get('#date').then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
