import { AccountDto } from '@local/types';

import {
  getAllTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
} from '../apiHelpers';

describe('Edit income', () => {
  before(() => {
    cy.applyFixture('large');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  const amountToChangeTransactionStr = '15.50';
  const amountToChangeTransaction = parseFloat(amountToChangeTransactionStr);
  const getEditedTransactionName = () =>
    `edited dummy transaction created by test code ${Math.random()}`;

  const verifyAccountBalanceChanges = (amount: number) =>
    cy.get<AccountDto>('@accountBefore').then((accountBefore) =>
      cy.get<AccountDto>('@accountAfter').then((accountAfter) => {
        const balanceBefore = roundToTwoDecimal(accountBefore.balance);
        const balanceAfter = roundToTwoDecimal(accountAfter.balance);

        expect(balanceBefore + amount).to.be.eq(balanceAfter);
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

  it('Edit newest income', () => {
    const editedTransactionName = getEditedTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const incomesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => !fromAccount && toAccount
        );
        const targetTransactionBefore = incomesBefore[incomesBefore.length - 1];

        const targetAccountId = targetTransactionBefore.toAccount;

        const laterTransactionWithSameAccountBefore = incomesBefore.find(
          ({ toAccount, _id }) =>
            toAccount === targetAccountId && _id !== targetTransactionBefore._id
        );

        cy.saveData(
          'laterTransactionWithSameAccountBefore',
          laterTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        cy.getById(targetTransactionBefore._id).click();

        cy.getById(`edit-income-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#toAccount').select(targetAccountId);
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

    verifyAccountBalanceChanges(amountToChangeTransaction);
    verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction
    );
  });

  it('Edit oldest income', () => {
    const editedTransactionName = getEditedTransactionName();
    cy.saveAsyncData('transactionsBefore', getAllTransaction);

    cy.get<ITransactionWithDateObject[]>('@transactionsBefore').then(
      (transactionsBefore) => {
        const incomesBefore = transactionsBefore.filter(
          ({ fromAccount, toAccount }) => !fromAccount && toAccount
        );
        const targetTransactionBefore = incomesBefore[1];

        const targetAccountId = targetTransactionBefore.toAccount;

        const laterTransactionWithSameAccountBefore = incomesBefore.find(
          ({ toAccount, _id }) =>
            toAccount === targetAccountId && _id !== targetTransactionBefore._id
        );

        cy.saveData(
          'laterTransactionWithSameAccountBefore',
          laterTransactionWithSameAccountBefore
        );
        cy.saveData('targetTransactionBefore', targetTransactionBefore);
        cy.saveAsyncData('accountBefore', () => getAccount(targetAccountId));

        const newAmount =
          targetTransactionBefore.amount + amountToChangeTransaction;

        cy.getById(targetTransactionBefore._id).click();

        cy.getById(`edit-income-button`).click();
        cy.get('#description').clear();
        cy.get('#description').type(editedTransactionName);
        cy.get('#amount').clear();
        cy.get('#amount').type(newAmount.toString());
        cy.get('#toAccount').select(targetAccountId);
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

    verifyAccountBalanceChanges(amountToChangeTransaction);
    verifyTargetTransactionChanged(
      editedTransactionName,
      amountToChangeTransaction
    );
  });
});
