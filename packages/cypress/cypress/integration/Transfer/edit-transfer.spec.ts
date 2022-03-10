import { IAccount } from '@local/types';

import {
  getAllUserTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '../apiHelpers';

const verifyToAccountBalanceChangeByTransactionBeforeAmount = (
  changedAmount: number
) =>
  cy.get<IAccount>('@fromAccountBefore').then((accountBefore) =>
    cy.get<IAccount>('@fromAccountAfter').then((accountAfter) => {
      const balanceBefore = roundToTwoDecimal(accountBefore.balance);
      const balanceAfter = roundToTwoDecimal(accountAfter.balance);
      const balanceBeforeWithChangedAmount = roundToTwoDecimal(
        balanceBefore - changedAmount
      );

      expect(balanceBeforeWithChangedAmount).to.be.eq(balanceAfter);
    })
  );

const verifyFromAccountBalanceChangeByTransactionBeforeAmount = (
  changedAmount: number
) =>
  cy.get<IAccount>('@toAccountBefore').then((accountBefore) =>
    cy.get<IAccount>('@toAccountAfter').then((accountAfter) => {
      const balanceBefore = roundToTwoDecimal(accountBefore.balance);
      const balanceAfter = roundToTwoDecimal(accountAfter.balance);
      const balanceBeforeWithChangedAmount = roundToTwoDecimal(
        balanceBefore + changedAmount
      );

      expect(balanceBeforeWithChangedAmount).to.be.eq(balanceAfter);
    })
  );

const verifyTargetTransactionChangeAfter = (
  newName: string,
  changedAmount: number
) => {
  cy.get<ITransactionWithDateObject>('@targetTransactionBefore').then(
    (targetTransactionBefore) =>
      cy
        .get<ITransactionWithDateObject>('@targetTransactionAfter')
        .then((targetTransactionAfter) => {
          const targetTransactionAfterName = targetTransactionAfter.description;
          const targetTransactionAfterAmount = roundToTwoDecimal(
            targetTransactionAfter.amount
          );
          const targetTransactionBeforeName =
            targetTransactionBefore.description;
          const targetTransactionBeforeAmount = roundToTwoDecimal(
            targetTransactionBefore.amount
          );

          expect(targetTransactionBeforeName).not.to.be.eq(newName);
          expect(targetTransactionAfterName).to.be.eq(newName);
          expect(targetTransactionBeforeAmount + changedAmount).to.be.eq(
            targetTransactionAfterAmount
          );
        })
  );
};

describe('Edit transfer', () => {
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/transfers');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const editedTransactionName = 'edited dummy transaction created by test code';

  it('Edit newest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const transfersBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && toAccount
        );
        const targetTransactionBefore =
          transfersBefore[transfersBefore.length - 1];

        const targetTransactionId = targetTransactionBefore._id;
        const targetToAccountId = targetTransactionBefore.toAccount;
        const targetFromAccountId = targetTransactionBefore.fromAccount;

        const olderTransactionWithSameAccountBefore = transfersBefore.find(
          ({ toAccount, fromAccount, _id }) =>
            toAccount === targetToAccountId &&
            fromAccount === targetFromAccountId &&
            _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        // cy.getById(targetTransactionBefore._id).click();
        // Due to pager on transfers page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/transfers/${targetTransactionBefore._id}`
        );
        cy.getById(`edit-transfer-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#toAccount').select(targetToAccountId);
        cy.get('#fromAccount').select(targetFromAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/edit')
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyToAccountBalanceChangeByTransactionBeforeAmount(
      amountToChangeTransaction
    );
    verifyFromAccountBalanceChangeByTransactionBeforeAmount(
      amountToChangeTransaction
    );
    verifyTargetTransactionChangeAfter(
      editedTransactionName,
      amountToChangeTransaction
    );

    cy.get<ITransactionWithDateObject>(
      '@olderTransactionWithSameAccountBefore'
    ).then((olderTransactionWithSameAccountBefore) =>
      cy
        .get<ITransactionWithDateObject>(
          '@olderTransactionWithSameAccountAfter'
        )
        .then((olderTransactionWithSameAccountAfter) => {
          const olderTransactionWithSameAccountAfterToAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountAfter.toAccountBalance
            );
          const olderTransactionWithSameAccountBeforeToAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountBefore.toAccountBalance
            );
          const olderTransactionWithSameAccountAfterFromAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountAfter.fromAccountBalance
            );
          const olderTransactionWithSameAccountBeforeFromAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountBefore.fromAccountBalance
            );

          expect(
            olderTransactionWithSameAccountBeforeToAccountBalance
          ).to.be.eq(olderTransactionWithSameAccountAfterToAccountBalance);
          expect(
            olderTransactionWithSameAccountAfterFromAccountBalance
          ).to.be.eq(olderTransactionWithSameAccountBeforeFromAccountBalance);
        })
    );
  });

  it('Edit oldest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const transfersBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && toAccount
        );
        const targetTransactionBefore = transfersBefore[0];

        const targetTransactionId = targetTransactionBefore._id;
        const targetToAccountId = targetTransactionBefore.toAccount;
        const targetFromAccountId = targetTransactionBefore.fromAccount;

        const olderTransactionWithSameAccountBefore = transfersBefore.find(
          ({ toAccount, fromAccount, _id }) =>
            toAccount === targetToAccountId &&
            fromAccount === targetFromAccountId &&
            _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('toAccountBefore', () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData('fromAccountBefore', () =>
          getAccount(targetFromAccountId)
        );

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        // cy.getById(targetTransactionBefore._id).click();
        // Due to pager on transfers page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/transfers/${targetTransactionBefore._id}`
        );
        cy.getById(`edit-transfer-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#toAccount').select(targetToAccountId);
        cy.get('#fromAccount').select(targetFromAccountId);
        cy.getById('submit').click();

        cy.location('pathname')
          .should('not.contain', '/edit')
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('targetTransactionAfter', () =>
              getTransactionById(targetTransactionBefore._id)
            );
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyToAccountBalanceChangeByTransactionBeforeAmount(
      amountToChangeTransaction
    );
    verifyFromAccountBalanceChangeByTransactionBeforeAmount(
      amountToChangeTransaction
    );
    verifyTargetTransactionChangeAfter(
      editedTransactionName,
      amountToChangeTransaction
    );

    cy.get<ITransactionWithDateObject>(
      '@olderTransactionWithSameAccountBefore'
    ).then((olderTransactionWithSameAccountBefore) =>
      cy
        .get<ITransactionWithDateObject>(
          '@olderTransactionWithSameAccountAfter'
        )
        .then((olderTransactionWithSameAccountAfter) => {
          const olderTransactionWithSameAccountAfterToAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountAfter.toAccountBalance
            );
          const olderTransactionWithSameAccountBeforeToAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountBefore.toAccountBalance
            );
          const olderTransactionWithSameAccountAfterFromAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountAfter.fromAccountBalance
            );
          const olderTransactionWithSameAccountBeforeFromAccountBalance =
            roundToTwoDecimal(
              olderTransactionWithSameAccountBefore.fromAccountBalance
            );

          expect(
            olderTransactionWithSameAccountBeforeToAccountBalance +
              amountToChangeTransaction
          ).to.be.eq(olderTransactionWithSameAccountAfterToAccountBalance);

          expect(
            olderTransactionWithSameAccountAfterFromAccountBalance +
              amountToChangeTransaction
          ).to.be.eq(olderTransactionWithSameAccountBeforeFromAccountBalance);
        })
    );
  });
});
