import {
  getAllUserTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getTransactionById,
  getAllAccountTransactionsById,
} from "../apiHelpers";

describe("Add expense", () => {
  beforeEach(() => cy.visit("http://localhost:3000/statistics/expenses"));
  const newTransactionAmountStr = "15.50";
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = "new dummy transaction created by test code";

  it("Add latest expense", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetTransactionBefore =
        transactionsBefore[transactionsBefore.length - 1];
      const targetAccountId = targetTransactionBefore.toAccount;
      const accountBefore = await getAccount(targetAccountId);
      const newTransactionDate = new Date(
        targetTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
      );

      cy.get("[data-testid=add-expense]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#fromAccount").select(targetAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountAfter = await getAccount(targetAccountId);
          const targetTransactionAfter = await getTransactionById(
            targetTransactionBefore._id
          );

          expect(accountBefore.balance - newTransactionAmount).to.be.eq(
            accountAfter.balance
          );
          expect(targetTransactionBefore.toAccountBalance).to.be.eq(
            targetTransactionAfter.toAccountBalance
          );
        });
    });
  });

  it("Add second latest expense", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetTransactionBefore =
        transactionsBefore[transactionsBefore.length - 1];
      const targetAccountId = targetTransactionBefore.toAccount;
      const accountBefore = await getAccount(targetAccountId);
      const newTransactionDate = new Date(
        targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
      );

      cy.get("[data-testid=add-expense]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#fromAccount").select(targetAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountAfter = await getAccount(targetAccountId);
          const targetTransactionAfter = await getTransactionById(
            targetTransactionBefore._id
          );

          expect(accountBefore.balance - newTransactionAmount).to.be.eq(
            accountAfter.balance
          );
          expect(
            targetTransactionBefore.toAccountBalance - newTransactionAmount
          ).to.be.eq(targetTransactionAfter.toAccountBalance);
        });
    });
  });

  it("Add first expense", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetTransactionBefore = transactionsBefore[0];
      const targetAccountId = targetTransactionBefore.toAccount;
      const accountBefore = await getAccount(targetAccountId);
      const newTransactionDate = new Date(
        targetTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
      );

      cy.get("[data-testid=add-expense]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#fromAccount").select(targetAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountAfter = await getAccount(targetAccountId);
          const transactionsAfter = await getAllAccountTransactionsById(
            targetAccountId
          );

          expect(accountBefore.balance - newTransactionAmount).to.be.eq(
            accountAfter.balance
          );

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
                beforeTargetAccountBalanse - newTransactionAmount
              ).to.be.eq(afterTargetAccountBalanse);
            });
        });
    });
  });

  it("Check that date is correct", () => {
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);

    cy.getById("add-expense").click();
    cy.get("#description").clear();
    cy.get("#description").type(newTransactionName);
    cy.get("#date").clear();
    cy.get("#date").type(formatDate(date));
    cy.get("#amount").clear();
    cy.get("#amount").type(newTransactionAmountStr);
    cy.getById("submit").click();

    cy.getById("transaction-stacked-list-container")
      .contains(newTransactionName)
      .click();
    cy.getById("edit-expense-button").click();
    cy.get("#date").then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    });
  });
});
