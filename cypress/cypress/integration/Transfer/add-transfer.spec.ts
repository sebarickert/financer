import {
  getAllUserTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getTransactionById,
  ITransactionWithDateObject,
  roundToTwoDecimal,
  getAccountFromTransactions,
  getAccountBalanceFromTransactions,
} from "../apiHelpers";

describe("Add transfer", () => {
  beforeEach(() => {
    cy.applyFixture("large");
    cy.visit("http://localhost:3000/statistics/transfers");
  });

  const newTransactionAmountStr = "15.50";
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = "new dummy transaction created by test code";

  it("Add newest transfer", () => {
    cy.saveAsyncData("transactionsBefore", getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>("@transactionsBefore").then(
      (transactionsBefore) => {
        const targetToAccountTransactionBefore =
          transactionsBefore[transactionsBefore.length - 1];
        const targetToAccountId = getAccountFromTransactions(
          targetToAccountTransactionBefore
        );

        const targetFromAccountTransactionBefore = transactionsBefore.filter(
          ({ toAccount, fromAccount }) =>
            toAccount !== targetToAccountId && fromAccount !== targetToAccountId
        )[0];

        const targetFromAccountId = getAccountFromTransactions(
          targetFromAccountTransactionBefore
        );

        const newTransactionDate = new Date(
          targetToAccountTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
        );

        cy.saveData(
          "targetToAccountTransactionBefore",
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData("accountToAccountBefore", () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData("accountFromAccountBefore", () =>
          getAccount(targetFromAccountId)
        );

        cy.getById("add-transfer").click();
        cy.get("#description").clear();
        cy.get("#description").type(newTransactionName);
        cy.get("#date").clear();
        cy.get("#date").type(formatDate(newTransactionDate));
        cy.get("#amount").clear();
        cy.get("#amount").type(newTransactionAmountStr);
        cy.get("#toAccount").select(targetToAccountId);
        cy.get("#fromAccount").select(targetFromAccountId);
        cy.getById("submit").click();

        cy.location("pathname")
          .should("not.contain", "/add")
          .then(() => {
            cy.saveAsyncData("accountToAcccountAfter", () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData("accountFromAcccountAfter", () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData("targetToAccountTransactionAfter", () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );
    cy.get<IAccount>("@accountToAccountBefore").then((accountToAccountBefore) =>
      cy
        .get<IAccount>("@accountToAcccountAfter")
        .then((accountToAcccountAfter) => {
          const balanceBefore = roundToTwoDecimal(
            accountToAccountBefore.balance
          );
          const balanceAfter = roundToTwoDecimal(
            accountToAcccountAfter.balance
          );

          expect(balanceBefore + newTransactionAmount).to.be.eq(balanceAfter);
        })
    );

    cy.get<IAccount>("@accountFromAccountBefore").then(
      (accountFromAccountBefore) =>
        cy
          .get<IAccount>("@accountFromAcccountAfter")
          .then((accountFromAcccountAfter) => {
            const balanceBefore = roundToTwoDecimal(
              accountFromAccountBefore.balance
            );
            const balanceAfter = roundToTwoDecimal(
              accountFromAcccountAfter.balance
            );

            expect(balanceBefore - newTransactionAmount).to.be.eq(balanceAfter);
          })
    );

    cy.get<ITransaction>("@targetToAccountTransactionBefore").then(
      (targetToAccountTransactionBefore) =>
        cy
          .get<ITransaction>("@targetToAccountTransactionAfter")
          .then((targetToAccountTransactionAfter) => {
            const toAccountBalanceBefore = getAccountBalanceFromTransactions(
              targetToAccountTransactionBefore
            );
            const toAccountBalanceAfter = getAccountBalanceFromTransactions(
              targetToAccountTransactionAfter
            );

            expect(toAccountBalanceBefore).to.be.eq(toAccountBalanceAfter);
          })
    );
  });

  it("Add newest latest transfer", () => {
    cy.saveAsyncData("transactionsBefore", getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>("@transactionsBefore").then(
      (transactionsBefore) => {
        const targetToAccountTransactionBefore =
          transactionsBefore[transactionsBefore.length - 1];
        const targetToAccountId = getAccountFromTransactions(
          targetToAccountTransactionBefore
        );

        const targetFromAccountTransactionBefore = transactionsBefore.filter(
          ({ toAccount, fromAccount }) =>
            toAccount !== targetToAccountId && fromAccount !== targetToAccountId
        )[0];

        const targetFromAccountId = getAccountFromTransactions(
          targetFromAccountTransactionBefore
        );

        const newTransactionDate = new Date(
          targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        cy.saveData(
          "targetToAccountTransactionBefore",
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData("accountToAccountBefore", () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData("accountFromAccountBefore", () =>
          getAccount(targetFromAccountId)
        );

        cy.getById("add-transfer").click();
        cy.get("#description").clear();
        cy.get("#description").type(newTransactionName);
        cy.get("#date").clear();
        cy.get("#date").type(formatDate(newTransactionDate));
        cy.get("#amount").clear();
        cy.get("#amount").type(newTransactionAmountStr);
        cy.get("#toAccount").select(targetToAccountId);
        cy.get("#fromAccount").select(targetFromAccountId);
        cy.getById("submit").click();

        cy.location("pathname")
          .should("not.contain", "/add")
          .then(() => {
            cy.saveAsyncData("accountToAcccountAfter", () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData("accountFromAcccountAfter", () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData("targetToAccountTransactionAfter", () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );
    cy.get<IAccount>("@accountToAccountBefore").then((accountToAccountBefore) =>
      cy
        .get<IAccount>("@accountToAcccountAfter")
        .then((accountToAcccountAfter) => {
          const balanceBefore = roundToTwoDecimal(
            accountToAccountBefore.balance
          );
          const balanceAfter = roundToTwoDecimal(
            accountToAcccountAfter.balance
          );

          expect(balanceBefore + newTransactionAmount).to.be.eq(balanceAfter);
        })
    );

    cy.get<IAccount>("@accountFromAccountBefore").then(
      (accountFromAccountBefore) =>
        cy
          .get<IAccount>("@accountFromAcccountAfter")
          .then((accountFromAcccountAfter) => {
            const balanceBefore = roundToTwoDecimal(
              accountFromAccountBefore.balance
            );
            const balanceAfter = roundToTwoDecimal(
              accountFromAcccountAfter.balance
            );

            expect(balanceBefore - newTransactionAmount).to.be.eq(balanceAfter);
          })
    );

    cy.get<ITransaction>("@targetToAccountTransactionBefore").then(
      (targetToAccountTransactionBefore) =>
        cy
          .get<ITransaction>("@targetToAccountTransactionAfter")
          .then((targetToAccountTransactionAfter) => {
            const toAccountBalanceBefore = getAccountBalanceFromTransactions(
              targetToAccountTransactionBefore
            );
            const toAccountBalanceAfter = getAccountBalanceFromTransactions(
              targetToAccountTransactionAfter
            );

            expect(toAccountBalanceBefore + newTransactionAmount).to.be.eq(
              toAccountBalanceAfter
            );
          })
    );
  });

  it("Add oldest transfer", () => {
    cy.saveAsyncData("transactionsBefore", getAllUserTransaction);

    cy.get<ITransactionWithDateObject[]>("@transactionsBefore").then(
      (transactionsBefore) => {
        const targetToAccountTransactionBefore = transactionsBefore[0];
        const targetToAccountId = getAccountFromTransactions(
          targetToAccountTransactionBefore
        );

        const targetFromAccountTransactionBefore = transactionsBefore.filter(
          ({ toAccount, fromAccount }) =>
            toAccount !== targetToAccountId && fromAccount !== targetToAccountId
        )[0];

        const targetFromAccountId = getAccountFromTransactions(
          targetFromAccountTransactionBefore
        );

        const newTransactionDate = new Date(
          targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
        );

        cy.saveData(
          "targetToAccountTransactionBefore",
          targetToAccountTransactionBefore
        );
        cy.saveAsyncData("accountToAccountBefore", () =>
          getAccount(targetToAccountId)
        );
        cy.saveAsyncData("accountFromAccountBefore", () =>
          getAccount(targetFromAccountId)
        );

        cy.getById("add-transfer").click();
        cy.get("#description").clear();
        cy.get("#description").type(newTransactionName);
        cy.get("#date").clear();
        cy.get("#date").type(formatDate(newTransactionDate));
        cy.get("#amount").clear();
        cy.get("#amount").type(newTransactionAmountStr);
        cy.get("#toAccount").select(targetToAccountId);
        cy.get("#fromAccount").select(targetFromAccountId);
        cy.getById("submit").click();

        cy.location("pathname")
          .should("not.contain", "/add")
          .then(() => {
            cy.saveAsyncData("accountToAcccountAfter", () =>
              getAccount(targetToAccountId)
            );
            cy.saveAsyncData("accountFromAcccountAfter", () =>
              getAccount(targetFromAccountId)
            );
            cy.saveAsyncData("targetToAccountTransactionAfter", () =>
              getTransactionById(targetToAccountTransactionBefore._id)
            );
          });
      }
    );
    cy.get<IAccount>("@accountToAccountBefore").then((accountToAccountBefore) =>
      cy
        .get<IAccount>("@accountToAcccountAfter")
        .then((accountToAcccountAfter) => {
          const balanceBefore = roundToTwoDecimal(
            accountToAccountBefore.balance
          );
          const balanceAfter = roundToTwoDecimal(
            accountToAcccountAfter.balance
          );

          expect(balanceBefore + newTransactionAmount).to.be.eq(balanceAfter);
        })
    );

    cy.get<IAccount>("@accountFromAccountBefore").then(
      (accountFromAccountBefore) =>
        cy
          .get<IAccount>("@accountFromAcccountAfter")
          .then((accountFromAcccountAfter) => {
            const balanceBefore = roundToTwoDecimal(
              accountFromAccountBefore.balance
            );
            const balanceAfter = roundToTwoDecimal(
              accountFromAcccountAfter.balance
            );

            expect(balanceBefore - newTransactionAmount).to.be.eq(balanceAfter);
          })
    );

    cy.get<ITransaction>("@targetToAccountTransactionBefore").then(
      (targetToAccountTransactionBefore) =>
        cy
          .get<ITransaction>("@targetToAccountTransactionAfter")
          .then((targetToAccountTransactionAfter) => {
            const toAccountBalanceBefore = getAccountBalanceFromTransactions(
              targetToAccountTransactionBefore
            );
            const toAccountBalanceAfter = getAccountBalanceFromTransactions(
              targetToAccountTransactionAfter
            );

            expect(toAccountBalanceBefore + newTransactionAmount).to.be.eq(
              toAccountBalanceAfter
            );
          })
    );
  });

  it("Check that date is correct", () => {
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    cy.getById("add-transfer").click();
    cy.get("#description").clear();
    cy.get("#description").type(newTransactionName);
    cy.get("#date").clear();
    cy.get("#date").type(formatDate(date));
    cy.get("#amount").clear();
    cy.get("#amount").type(newTransactionAmountStr);
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");
    cy.getById("submit").click();

    cy.getById("transaction-stacked-list-container")
      .contains(newTransactionName)
      .click();
    cy.getById("edit-transfer-button").click();
    cy.get("#date").then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
