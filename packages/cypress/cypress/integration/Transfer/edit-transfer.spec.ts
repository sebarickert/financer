import { AccountDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '../apiHelpers';

describe('Edit transfer', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/transfers');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyToAccountBalanceChanges = (amount: number) =>
    cy.get<AccountDto>('@toAccountBefore').then((accountBefore) =>
      cy.get<AccountDto>('@toAccountAfter').then((accountAfter) => {
        const balanceBefore = roundToTwoDecimal(accountBefore.balance);
        const balanceAfter = roundToTwoDecimal(accountAfter.balance);

        expect(balanceBefore + amount).to.be.eq(balanceAfter);
      })
    );

  const verifyFromAccountBalanceChanges = (amount: number) =>
    cy.get<AccountDto>('@fromAccountBefore').then((accountBefore) =>
      cy.get<AccountDto>('@fromAccountAfter').then((accountAfter) => {
        const balanceBefore = roundToTwoDecimal(accountBefore.balance);
        const balanceAfter = roundToTwoDecimal(accountAfter.balance);

        expect(balanceBefore - amount).to.be.eq(balanceAfter);
      })
    );

  const verifyTargetTransactionChanged = (
    newName: string,
    changedAmount: number
  ) =>
    cy
      .get<ITransactionWithDateObject>('@targetTransactionBefore')
      .then((targetTransactionBefore) =>
        cy
          .get<ITransactionWithDateObject>('@targetTransactionAfter')
          .then((targetTransactionAfter) => {
            const nameAfter = targetTransactionAfter.description;
            const amountAfter = roundToTwoDecimal(
              targetTransactionAfter.amount
            );

            const nameBefore = targetTransactionBefore.description;
            const amountBefore = roundToTwoDecimal(
              targetTransactionBefore.amount
            );

            expect(nameBefore).not.to.be.eq(newName);
            expect(nameAfter).to.be.eq(newName);
            expect(amountBefore + changedAmount).to.be.eq(amountAfter);
          })
      );

  it('Edit newest transfer', () => {
    const editedTransactionName = getEditedTransactionName();
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

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        cy.visit('http://localhost:3000/statistics/transfers/2022-01');

        cy.getById(targetTransactionBefore._id).click();

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

    verifyToAccountBalanceChanges(amountToChangeTransaction);
    verifyFromAccountBalanceChanges(amountToChangeTransaction);
    verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction
    );
  });

  it('Edit oldest transfer', () => {
    const editedTransactionName = getEditedTransactionName();
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

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        cy.visit('http://localhost:3000/statistics/transfers/2021-02');

        cy.getById(targetTransactionBefore._id).click();

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

    verifyToAccountBalanceChanges(amountToChangeTransaction);
    verifyFromAccountBalanceChanges(amountToChangeTransaction);
    verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction
    );
  });
});
