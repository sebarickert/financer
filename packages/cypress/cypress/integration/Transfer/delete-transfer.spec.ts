import { IAccount, ITransaction } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '../apiHelpers';

describe('Delete transfer', () => {
  before(() => {
    cy.applyFixture('large');
  });

  const verifyToAccountBalanceChangeByTargetTransactionAmount = () =>
    cy.get<IAccount>('@toAccountBefore').then((accountBefore) =>
      cy.get<IAccount>('@toAccountAfter').then((accountAfter) =>
        cy
          .get<ITransaction>('@targetTransactionBefore')
          .then((targetTransactionBefore) => {
            const changedAmount = roundToTwoDecimal(
              targetTransactionBefore.amount
            );
            const balanceBefore = roundToTwoDecimal(accountBefore.balance);
            const balanceAfter = roundToTwoDecimal(accountAfter.balance);
            const balanceBeforeWithChangedAmount = roundToTwoDecimal(
              balanceBefore - changedAmount
            );

            expect(balanceBeforeWithChangedAmount).to.be.eq(balanceAfter);
          })
      )
    );

  const verifyFromAccountBalanceChangeByTargetTransactionAmount = () =>
    cy.get<IAccount>('@fromAccountBefore').then((accountBefore) =>
      cy.get<IAccount>('@fromAccountAfter').then((accountAfter) =>
        cy
          .get<ITransaction>('@targetTransactionBefore')
          .then((targetTransactionBefore) => {
            const changedAmount = roundToTwoDecimal(
              targetTransactionBefore.amount
            );
            const balanceBefore = roundToTwoDecimal(accountBefore.balance);
            const balanceAfter = roundToTwoDecimal(accountAfter.balance);
            const balanceBeforeWithChangedAmount = roundToTwoDecimal(
              balanceBefore + changedAmount
            );

            expect(balanceBeforeWithChangedAmount).to.be.eq(balanceAfter);
          })
      )
    );

  const verifyTargetTransactionDoesNotExistsAfter = () => {
    cy.get<ITransaction>('@targetTransactionBefore').then(
      (targetTransactionBefore) =>
        cy.saveAsyncData('targetTransactionAfter', () =>
          getTransactionByIdRaw(targetTransactionBefore._id)
        )
    );
    cy.get<ITransactionWithDateObject>('@targetTransactionAfter').then(
      (targetTransactionAfter) => {
        expect((targetTransactionAfter as any).statusCode).to.be.equal(404);
      }
    );
  };

  it('Delete newest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

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

        // cy.getById(targetTransactionId).click();
        // Due to pager on transfers page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/transfers/${targetTransactionId}`
        );

        cy.getById('transfer-delete-modal_open-button').click();
        cy.getById('transfer-delete-modal_confirm-button').click();

        cy.location('pathname')
          .should('not.contain', `/${targetTransactionId}`)
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyToAccountBalanceChangeByTargetTransactionAmount();
    verifyFromAccountBalanceChangeByTargetTransactionAmount();
    verifyTargetTransactionDoesNotExistsAfter();
  });

  it('Delete oldest transfer', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

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

        // cy.getById(targetTransactionBefore._id).click();
        // Due to pager on transfers page, we need this workaround and navigate to url manually
        cy.visit(
          `http://localhost:3000/statistics/transfers/${targetTransactionBefore._id}`
        );

        cy.getById('transfer-delete-modal_open-button').click();
        cy.getById('transfer-delete-modal_confirm-button').click();

        cy.location('pathname')
          .should('not.contain', `/${targetTransactionId}`)
          .then(() => {
            cy.saveAsyncData('toAccountAfter', () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData('fromAccountAfter', () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyToAccountBalanceChangeByTargetTransactionAmount();
    verifyFromAccountBalanceChangeByTargetTransactionAmount();
    verifyTargetTransactionDoesNotExistsAfter();
  });
});
