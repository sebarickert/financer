import {
  getAllUserTransaction,
  getAccount,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getTransactionByIdRaw,
} from '../apiHelpers';

const verifyToAccountBalanceChangeByTransactionBeforeAmount = () =>
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

const verifyFromAccountBalanceChangeByTransactionBeforeAmount = () =>
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

const verifyTargetTransactionDoesNotExistsAfter = () => {
  cy.get<ITransaction>('@targetTransactionBefore').then(
    (targetTransactionBefore) =>
      cy.saveAsyncData('targetTransactionAfter', () =>
        getTransactionByIdRaw(targetTransactionBefore._id)
      )
  );
  cy.get<ITransactionWithDateObject>('@targetTransactionAfter').then(
    (targetTransactionAfter) => {
      expect(targetTransactionAfter).to.be.undefined;
    }
  );
};

describe('Delete transfer', () => {
  beforeEach(() => {
    cy.applyFixture('large');
    cy.visit('http://localhost:3000/statistics/transfers');
  });

  it('Delete newest transfer', () => {
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

    verifyToAccountBalanceChangeByTransactionBeforeAmount();
    verifyFromAccountBalanceChangeByTransactionBeforeAmount();
    verifyTargetTransactionDoesNotExistsAfter();

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

          expect(
            olderTransactionWithSameAccountBeforeToAccountBalance
          ).to.be.eq(olderTransactionWithSameAccountAfterToAccountBalance);
        })
    );
  });

  it('Delete oldest transfer', () => {
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

    verifyToAccountBalanceChangeByTransactionBeforeAmount();
    verifyFromAccountBalanceChangeByTransactionBeforeAmount();
    verifyTargetTransactionDoesNotExistsAfter();

    cy.get<ITransactionWithDateObject>(
      '@olderTransactionWithSameAccountBefore'
    ).then((olderTransactionWithSameAccountBefore) =>
      cy
        .get<ITransactionWithDateObject>(
          '@olderTransactionWithSameAccountAfter'
        )
        .then((olderTransactionWithSameAccountAfter) =>
          cy
            .get<ITransaction>('@targetTransactionBefore')
            .then((targetTransactionBefore) => {
              const changedAmount = roundToTwoDecimal(
                targetTransactionBefore.amount
              );

              const olderTransactionWithSameAccountAfterToAccountBalance =
                roundToTwoDecimal(
                  olderTransactionWithSameAccountAfter.toAccountBalance
                );
              const olderTransactionWithSameAccountBeforeToAccountBalance =
                roundToTwoDecimal(
                  olderTransactionWithSameAccountBefore.toAccountBalance
                );

              expect(
                olderTransactionWithSameAccountBeforeToAccountBalance -
                  changedAmount
              ).to.be.eq(olderTransactionWithSameAccountAfterToAccountBalance);
            })
        )
    );
  });
});
