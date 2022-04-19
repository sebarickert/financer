import { AccountDto, TransactionDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '../apiHelpers';

describe('Delete expense', () => {
  before(() => {
    cy.applyFixture('large');
  });

  const verifyAccountBalanceChangeByTargetTransactionAmount = () =>
    cy.get<AccountDto>('@accountBefore').then((accountBefore) =>
      cy.get<AccountDto>('@accountAfter').then((accountAfter) =>
        cy
          .get<TransactionDto>('@targetTransactionBefore')
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
    cy.get<TransactionDto>('@targetTransactionBefore').then(
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

  it('Delete newest expense', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const expensesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && !toAccount
        );
        const targetTransactionBefore =
          expensesBefore[expensesBefore.length - 1];

        const targetTransactionId = targetTransactionBefore._id;
        const targetAccountId = targetTransactionBefore.fromAccount;

        const olderTransactionWithSameAccountBefore = expensesBefore.find(
          ({ fromAccount, _id }) =>
            fromAccount === targetAccountId && _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.getById(targetTransactionId).click();

        cy.getById('expense-delete-modal_open-button').click();
        cy.getById('expense-delete-modal_confirm-button').click();

        cy.location('pathname')
          .should('not.contain', `/${targetAccountId}`)
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyAccountBalanceChangeByTargetTransactionAmount();
    verifyTargetTransactionDoesNotExistsAfter();
  });

  it('Delete oldest expense', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const expensesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => fromAccount && !toAccount
        );
        const targetTransactionBefore = expensesBefore[0];

        const targetTransactionId = targetTransactionBefore._id;
        const targetAccountId = targetTransactionBefore.fromAccount;

        const olderTransactionWithSameAccountBefore = expensesBefore.find(
          ({ fromAccount, _id }) =>
            fromAccount === targetAccountId && _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(500);
        cy.getById(targetTransactionId).click();

        cy.getById('expense-delete-modal_open-button').click();
        cy.getById('expense-delete-modal_confirm-button').click();

        cy.location('pathname')
          .should('not.contain', `/${targetAccountId}`)
          .then(() => {
            cy.saveAsyncData('accountAfter', () => getAccount(targetAccountId));
            cy.saveAsyncData('olderTransactionWithSameAccountAfter', () =>
              getTransactionById(olderTransactionWithSameAccountBefore._id)
            );
          });
      }
    );

    verifyAccountBalanceChangeByTargetTransactionAmount();
    verifyTargetTransactionDoesNotExistsAfter();
  });
});
