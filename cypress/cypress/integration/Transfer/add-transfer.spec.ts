import {
  getAllUserTransaction,
  getAccount,
  MINUTE_IN_MS,
  formatDate,
  getTransactionById,
} from "../apiHelpers";

describe("Add transfer", () => {
  beforeEach(() => cy.visit("http://localhost:3000/statistics/transfers"));
  const newTransactionAmountStr = "15.50";
  const newTransactionAmount = parseFloat(newTransactionAmountStr);
  const newTransactionName = "new dummy transaction created by test code";

  it("Add latest transfer", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetToAccountTransactionBefore =
        transactionsBefore[transactionsBefore.length - 1];
      const targetFromAccountTransactionBefore = transactionsBefore.filter(
        ({ toAccount, fromAccount }) =>
          toAccount !== targetToAccountTransactionBefore.toAccount &&
          fromAccount !== targetToAccountTransactionBefore.toAccount
      )[0];

      const targetToAccountId =
        targetToAccountTransactionBefore.toAccount ||
        targetToAccountTransactionBefore.fromAccount;
      const targetFromAccountId =
        targetFromAccountTransactionBefore.toAccount ||
        targetFromAccountTransactionBefore.fromAccount;
      const accountToAccountBefore = await getAccount(targetToAccountId);
      const accountFromAccountBefore = await getAccount(targetFromAccountId);
      const newTransactionDate = new Date(
        targetToAccountTransactionBefore.dateObj.getTime() + MINUTE_IN_MS
      );

      cy.get("[data-testid=add-transfer]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#toAccount").select(targetToAccountId);
      cy.get("#fromAccount").select(targetFromAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountToAcccountAfter = await getAccount(targetToAccountId);
          const accountFromAcccountAfter = await getAccount(
            targetFromAccountId
          );
          const targetToAccountTransactionAfter = await getTransactionById(
            targetToAccountTransactionBefore._id
          );

          expect(
            accountToAccountBefore.balance + newTransactionAmount
          ).to.be.eq(accountToAcccountAfter.balance);
          expect(
            accountFromAccountBefore.balance - newTransactionAmount
          ).to.be.eq(accountFromAcccountAfter.balance);

          expect(targetToAccountTransactionBefore.toAccountBalance).to.be.eq(
            targetToAccountTransactionAfter.toAccountBalance
          );
        });
    });
  });

  it("Add second latest transfer", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetToAccountTransactionBefore =
        transactionsBefore[transactionsBefore.length - 1];
      const targetFromAccountTransactionBefore = transactionsBefore.filter(
        ({ toAccount, fromAccount }) =>
          toAccount !== targetToAccountTransactionBefore.toAccount &&
          fromAccount !== targetToAccountTransactionBefore.toAccount
      )[0];

      const targetToAccountId =
        targetToAccountTransactionBefore.toAccount ||
        targetToAccountTransactionBefore.fromAccount;
      const targetFromAccountId =
        targetFromAccountTransactionBefore.toAccount ||
        targetFromAccountTransactionBefore.fromAccount;
      const accountToAccountBefore = await getAccount(targetToAccountId);
      const accountFromAccountBefore = await getAccount(targetFromAccountId);
      const newTransactionDate = new Date(
        targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
      );

      cy.get("[data-testid=add-transfer]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#toAccount").select(targetToAccountId);
      cy.get("#fromAccount").select(targetFromAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountToAcccountAfter = await getAccount(targetToAccountId);
          const accountFromAcccountAfter = await getAccount(
            targetFromAccountId
          );
          const targetToAccountTransactionAfter = await getTransactionById(
            targetToAccountTransactionBefore._id
          );

          expect(
            accountToAccountBefore.balance + newTransactionAmount
          ).to.be.eq(accountToAcccountAfter.balance);
          expect(
            accountFromAccountBefore.balance - newTransactionAmount
          ).to.be.eq(accountFromAcccountAfter.balance);

          expect(
            targetToAccountTransactionBefore.toAccountBalance +
              newTransactionAmount
          ).to.be.eq(targetToAccountTransactionAfter.toAccountBalance);
        });
    });
  });

  it("Add first transfer", () => {
    cy.wrap(null).then(async () => {
      const transactionsBefore = await getAllUserTransaction();
      const targetToAccountTransactionBefore = transactionsBefore[0];
      const targetFromAccountTransactionBefore = transactionsBefore.filter(
        ({ toAccount, fromAccount }) =>
          toAccount !== targetToAccountTransactionBefore.toAccount &&
          fromAccount !== targetToAccountTransactionBefore.toAccount
      )[0];

      const targetToAccountId =
        targetToAccountTransactionBefore.toAccount ||
        targetToAccountTransactionBefore.fromAccount;
      const targetFromAccountId =
        targetFromAccountTransactionBefore.toAccount ||
        targetFromAccountTransactionBefore.fromAccount;
      const accountToAccountBefore = await getAccount(targetToAccountId);
      const accountFromAccountBefore = await getAccount(targetFromAccountId);
      const newTransactionDate = new Date(
        targetToAccountTransactionBefore.dateObj.getTime() - MINUTE_IN_MS
      );

      cy.get("[data-testid=add-transfer]").click();
      cy.get("#description").clear();
      cy.get("#description").type(newTransactionName);
      cy.get("#date").clear();
      cy.get("#date").type(formatDate(newTransactionDate));
      cy.get("#amount").clear();
      cy.get("#amount").type(newTransactionAmountStr);
      cy.get("#toAccount").select(targetToAccountId);
      cy.get("#fromAccount").select(targetFromAccountId);
      cy.get("[data-testid=submit]")
        .click()
        .then(async () => {
          const accountToAcccountAfter = await getAccount(targetToAccountId);
          const accountFromAcccountAfter = await getAccount(
            targetFromAccountId
          );
          const targetToAccountTransactionAfter = await getTransactionById(
            targetToAccountTransactionBefore._id
          );

          expect(
            accountToAccountBefore.balance + newTransactionAmount
          ).to.be.eq(accountToAcccountAfter.balance);
          expect(
            accountFromAccountBefore.balance - newTransactionAmount
          ).to.be.eq(accountFromAcccountAfter.balance);

          expect(
            targetToAccountTransactionBefore.toAccountBalance +
              newTransactionAmount
          ).to.be.eq(targetToAccountTransactionAfter.toAccountBalance);
        });
    });
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
    cy.getById("submit").click()

    cy.getById("transaction-stacked-list-container").contains(newTransactionName).click();
    cy.getById("edit-transfer-button").click();
    cy.get("#date").then(($input) => {
      const inputValue = $input.val() as string;
      expect(date.toISOString()).equals(new Date(inputValue).toISOString());
    })
  });
});
