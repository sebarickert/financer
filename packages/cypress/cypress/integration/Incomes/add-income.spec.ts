import { IAccount, ITransaction } from '@local/types';

import {
  getAllUserTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getTransactionById,
  getAllAccountTransactionsById,
  ITransactionWithDateObject,
  getAccountFromTransactions,
  getAccountBalanceFromTransactions,
  roundToTwoDecimal,
  getAccountBalanceFromTransactionByAccountId,
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

  const verifyTargetTransactionBalance = (amount: number) =>
    cy
      .get<ITransaction>('@targetTransactionBefore')
      .then((targetTransactionBefore) => {
        cy.get<ITransaction>('@targetTransactionAfter').then(
          (targetTransactionAfter) => {
            const targetTransactionBeforeBalance =
              getAccountBalanceFromTransactions(targetTransactionBefore);
            const targetTransactionAfterBalance =
              getAccountBalanceFromTransactions(targetTransactionAfter);

            expect(targetTransactionBeforeBalance + amount).to.be.eq(
              targetTransactionAfterBalance
            );
          }
        );
      });

  const verifyNewTransactionBalance = (positionInTransactions: number) => {
    cy.get<ITransaction[]>('@transactionsAfter').then((transactionsAfter) => {
      cy.get<number>('@expectedAccountBalance').then(
        (expectedAccountBalance) => {
          const newTransaction = transactionsAfter.at(positionInTransactions);
          const newTransactionAccountBalance = roundToTwoDecimal(
            newTransaction.toAccountBalance
          );
          const roundedExpectedAccountBalance = roundToTwoDecimal(
            expectedAccountBalance
          );

          expect(newTransactionAccountBalance).to.be.eq(
            roundedExpectedAccountBalance
          );
        }
      );
    });
  };

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = 'new dummy transaction created by test code';

  it('Add newest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(-1);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));
        cy.get<IAccount>('@accountBefore').then((accountBefore) =>
          cy.saveData('expectedAccountBalance', accountBefore.balance)
        );

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
            cy.saveAsyncData('transactionsAfter', getAllUserTransaction);
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyTargetTransactionBalance(0);
    verifyNewTransactionBalance(-1);
  });

  it('Add second newest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(-1);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );
        cy.saveData(
          'expectedAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetTransactionBefore,
            targetAccountId
          )
        );

        cy.saveData('targetTransactionBefore', targetTransactionBefore);
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
            cy.saveAsyncData('transactionsAfter', getAllUserTransaction);
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyTargetTransactionBalance(newTransactionAmount);
    verifyNewTransactionBalance(-2);
  });

  it('Add oldest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore.at(0);

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );
        cy.saveData(
          'expectedAccountBalance',
          getAccountBalanceFromTransactionByAccountId(
            targetTransactionBefore,
            targetAccountId
          )
        );

        cy.saveData('targetAccountId', targetAccountId);
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
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
            cy.saveAsyncData('transactionsAfter', () =>
              getAllAccountTransactionsById(targetAccountId)
            );
          });
      }
    );

    verifyAccountBalanceChange(newTransactionAmount);
    verifyNewTransactionBalance(0);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        cy.get<ITransactionWithDateObject[]>('@transactionsAfter').then(
          (transactionsAfter) => {
            cy.get<string>('@targetAccountId').then((targetAccountId) => {
              transactionsAfter
                .filter(({ description }) => description !== newTransactionName)
                .forEach((transactionAfter) => {
                  const transactionBefore = transactionsBefore.find(
                    ({ _id }) => _id === transactionAfter._id
                  );

                  const beforeTargetAccountBalanse =
                    getAccountBalanceFromTransactionByAccountId(
                      transactionBefore,
                      targetAccountId
                    );
                  const afterTargetAccountBalanse =
                    getAccountBalanceFromTransactionByAccountId(
                      transactionAfter,
                      targetAccountId
                    );

                  expect(
                    roundToTwoDecimal(
                      beforeTargetAccountBalanse + newTransactionAmount
                    )
                  ).to.be.eq(afterTargetAccountBalanse);
                });
            });
          }
        );
      }
    );
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
