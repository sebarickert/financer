import { IAccount } from '@local/types';

import {
  getAllUserTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '../apiHelpers';

describe('Edit expense', () => {
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/expenses');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const editedTransactionName = 'edited dummy transaction created by test code';

  it('Edit newest expense', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const expensesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && !toAccount
        );
        const targetTransactionBefore =
          expensesBefore[expensesBefore.length - 1];

        const targetAccountId = targetTransactionBefore.fromAccount;

        const laterTransactionWithSameAccountBefore = expensesBefore.find(
          ({ fromAccount, _id }) =>
            fromAccount === targetAccountId &&
            _id !== targetTransactionBefore._id
        );

        cy.saveData(
          'laterTransactionWithSameAccountBefore',
          laterTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        // cy.getById(targetTransactionBefore._id).click();
        // Due to pager on expenses page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/expenses/${targetTransactionBefore._id}`
        );
        cy.getById(`edit-expense-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#fromAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/edit')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
            cy.saveAsyncData('laterTransactionWithSameAccountAfter', () =>
              getTransactionById(laterTransactionWithSameAccountBefore._id)
            );
          });
      }
    );
    cy.get<IAccount>('@accountBefore').then((accountBefore) =>
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        const balanceBefore = roundToTwoDecimal(accountBefore.balance);
        const balanceAfter = roundToTwoDecimal(accountAfter.balance);

        expect(balanceBefore - amountToChangeTransaction).to.be.eq(
          balanceAfter
        );
      })
    );

    cy.get<ITransactionWithDateObject>('@targetTransactionBefore').then(
      (targetTransactionBefore) =>
        cy
          .get<ITransactionWithDateObject>('@targetTransactionAfter')
          .then((targetTransactionAfter) => {
            const targetTransactionAfterName =
              targetTransactionAfter.description;
            const targetTransactionAfterAmount = roundToTwoDecimal(
              targetTransactionAfter.amount
            );
            const targetTransactionBeforeName =
              targetTransactionBefore.description;
            const targetTransactionBeforeAmount = roundToTwoDecimal(
              targetTransactionBefore.amount
            );

            expect(targetTransactionBeforeName).not.to.be.eq(
              editedTransactionName
            );
            expect(targetTransactionAfterName).to.be.eq(editedTransactionName);
            expect(
              targetTransactionBeforeAmount + amountToChangeTransaction
            ).to.be.eq(targetTransactionAfterAmount);
          })
    );
    cy.get<ITransactionWithDateObject>(
      '@laterTransactionWithSameAccountBefore'
    ).then((laterTransactionWithSameAccountBefore) =>
      cy
        .get<ITransactionWithDateObject>(
          '@laterTransactionWithSameAccountAfter'
        )
        .then((laterTransactionWithSameAccountAfter) => {
          const laterTransactionWithSameAccountAfterToAccountBalance =
            roundToTwoDecimal(
              laterTransactionWithSameAccountAfter.fromAccountBalance
            );
          const laterTransactionWithSameAccountBeforeToAccountBalance =
            roundToTwoDecimal(
              laterTransactionWithSameAccountBefore.fromAccountBalance
            );

          expect(
            laterTransactionWithSameAccountBeforeToAccountBalance
          ).to.be.eq(laterTransactionWithSameAccountAfterToAccountBalance);
        })
    );
  });

  it('Edit oldest expense', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const expensesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && !toAccount
        );
        const targetTransactionBefore = expensesBefore[0];

        const targetAccountId = targetTransactionBefore.fromAccount;

        const laterTransactionWithSameAccountBefore = expensesBefore.find(
          ({ fromAccount, _id }) =>
            fromAccount === targetAccountId &&
            _id !== targetTransactionBefore._id
        );

        cy.saveData(
          'laterTransactionWithSameAccountBefore',
          laterTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        // cy.getById(targetTransactionBefore._id).click();
        // Due to pager on expenses page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/expenses/${targetTransactionBefore._id}`
        );
        cy.getById(`edit-expense-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#fromAccount').select(targetAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/edit')
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
            cy.saveAsyncData('laterTransactionWithSameAccountAfter', () =>
              getTransactionById(laterTransactionWithSameAccountBefore._id)
            );
          });
      }
    );
    cy.get<IAccount>('@accountBefore').then((accountBefore) =>
      cy.get<IAccount>('@accountAfter').then((accountAfter) => {
        const balanceBefore = roundToTwoDecimal(accountBefore.balance);
        const balanceAfter = roundToTwoDecimal(accountAfter.balance);

        expect(balanceBefore - amountToChangeTransaction).to.be.eq(
          balanceAfter
        );
      })
    );

    cy.get<ITransactionWithDateObject>('@targetTransactionBefore').then(
      (targetTransactionBefore) =>
        cy
          .get<ITransactionWithDateObject>('@targetTransactionAfter')
          .then((targetTransactionAfter) => {
            const targetTransactionAfterFromAccountBalance = roundToTwoDecimal(
              targetTransactionAfter.fromAccountBalance
            );
            const targetTransactionBeforeFromAccountBalance = roundToTwoDecimal(
              targetTransactionBefore.fromAccountBalance
            );

            expect(targetTransactionAfterFromAccountBalance).to.be.eq(
              targetTransactionBeforeFromAccountBalance
            );
          })
    );
    cy.get<ITransactionWithDateObject>(
      '@laterTransactionWithSameAccountBefore'
    ).then((laterTransactionWithSameAccountBefore) =>
      cy
        .get<ITransactionWithDateObject>(
          '@laterTransactionWithSameAccountAfter'
        )
        .then((laterTransactionWithSameAccountAfter) => {
          const laterTransactionWithSameAccountAfterToAccountBalance =
            roundToTwoDecimal(
              laterTransactionWithSameAccountAfter.fromAccountBalance
            );
          const laterTransactionWithSameAccountBeforeToAccountBalance =
            roundToTwoDecimal(
              laterTransactionWithSameAccountBefore.fromAccountBalance
            );

          expect(
            laterTransactionWithSameAccountBeforeToAccountBalance -
              amountToChangeTransaction
          ).to.be.eq(laterTransactionWithSameAccountAfterToAccountBalance);
        })
    );
  });
});
