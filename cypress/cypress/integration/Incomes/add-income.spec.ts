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
} from '../apiHelpers';

describe('Add income', () => {
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  const newTransactionAmountStr = '15.50';
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = 'new dummy transaction created by test code';

  it('Add newest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore =
          transactionsBefore[transactionsBefore.length - 1];

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
        );

        cy.saveData('targetTransactionBefore', targetTransactionBefore);
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
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
          });
      }
    );

    cy.get<IAccount>('@accountBefore').then((accountBefore) => {
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        expect(accountBefore.balance + newTransactionAmount).to.be.eq(
          accountAfter.balance
        );
      });
    });

    cy.get<ITransaction>('@targetTransactionBefore').then(
      (targetTransactionBefore) => {
        cy.get<ITransaction>('@targetTransactionAfter').then(
          (targetTransactionAfter) => {
            expect(
              getAccountBalanceFromTransactions(targetTransactionBefore)
            ).to.be.eq(
              getAccountBalanceFromTransactions(targetTransactionAfter)
            );
          }
        );
      }
    );
  });

  it('Add second newest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore =
          transactionsBefore[transactionsBefore.length - 1];

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
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
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
          });
      }
    );

    cy.get<IAccount>('@accountBefore').then((accountBefore) => {
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        expect(accountBefore.balance + newTransactionAmount).to.be.eq(
          accountAfter.balance
        );
      });
    });

    cy.get<ITransaction>('@targetTransactionBefore').then(
      (targetTransactionBefore) => {
        cy.get<ITransaction>('@targetTransactionAfter').then(
          (targetTransactionAfter) => {
            expect(
              getAccountBalanceFromTransactions(targetTransactionBefore) +
                newTransactionAmount
            ).to.be.eq(
              getAccountBalanceFromTransactions(targetTransactionAfter)
            );
          }
        );
      }
    );
  });

  it('Add oldest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const targetTransactionBefore = transactionsBefore[0];

        const targetAccountId = getAccountFromTransactions(
          targetTransactionBefore
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

    cy.get<IAccount>('@accountBefore').then((accountBefore) => {
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        expect(accountBefore.balance + newTransactionAmount).to.be.eq(
          accountAfter.balance
        );
      });
    });

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
                    transactionBefore.toAccount === targetAccountId
                      ? transactionBefore.toAccountBalance
                      : transactionBefore.fromAccountBalance;
                  const afterTargetAccountBalanse =
                    transactionAfter.toAccount === targetAccountId
                      ? transactionAfter.toAccountBalance
                      : transactionAfter.fromAccountBalance;

                  expect(
                    beforeTargetAccountBalanse + newTransactionAmount
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
