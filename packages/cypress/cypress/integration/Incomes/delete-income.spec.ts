import { AccountDto, TransactionDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '../apiHelpers';

describe('Delete income', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/incomes');
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
              balanceBefore - changedAmount
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

  it('Delete newest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const incomesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => !fromAccount && toAccount
        );
        const targetTransactionBefore = incomesBefore[incomesBefore.length - 1];

        const targetTransactionId = targetTransactionBefore._id;
        const targetAccountId = targetTransactionBefore.toAccount;

        const olderTransactionWithSameAccountBefore = incomesBefore.find(
          ({ toAccount, _id }) =>
            toAccount === targetAccountId && _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        cy.getById(targetTransactionId).click();

        cy.getById('income-delete-modal_open-button').click();
        cy.getById('income-delete-modal_confirm-button').click();

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

  it('Delete oldest income', () => {
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const incomesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => !fromAccount && toAccount
        );
        const targetTransactionBefore = incomesBefore[0];

        const targetTransactionId = targetTransactionBefore._id;
        const targetAccountId = targetTransactionBefore.toAccount;

        const olderTransactionWithSameAccountBefore = incomesBefore.find(
          ({ toAccount, _id }) =>
            toAccount === targetAccountId && _id !== targetTransactionId
        );

        cy.saveData(
          'olderTransactionWithSameAccountBefore',
          olderTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        cy.getById(targetTransactionId).click();

        cy.getById('income-delete-modal_open-button').click();
        cy.getById('income-delete-modal_confirm-button').click();

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
