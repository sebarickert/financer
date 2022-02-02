const addAccountAndVefiryDetails = (
  accountType,
  accountBalance,
  expectedType,
  expextedBalance
) => {
  cy.get('[data-testid="account-row"').should(
    "not.have.text",
    `New Test ${expectedType} Account`
  );

  cy.get('[data-testid="add-account"]').click();

  // Add account form
  cy.get("#account").clear();
  cy.get("#account").type(`New Test ${expectedType} Account`);
  cy.get("#amount").clear();
  cy.get("#amount").type(accountBalance);
  cy.get("#type").select(accountType);
  cy.getById("submit").click();

  cy.get('[data-testid="account-row"]').should("have.length", 7);
  cy.get('[data-testid="account-row"]')
    .contains(`New Test ${expectedType} Account`)
    .click();

  cy.get('[data-testid="type"] > dd').should("have.text", expectedType);
  cy.get('[data-testid="balance"] > dd')
    .invoke("text")
    .invoke("replace", /\u00a0/g, " ")
    .should("equal", expextedBalance);
};

describe("Account creation", () => {
  beforeEach(() => cy.visit("http://localhost:3000/accounts"));

  it("Verify accounts in fixture", () => {
    cy.get('[data-testid="account-row"').should("have.length", 6);
  });

  it("Add Cash account", () => {
    addAccountAndVefiryDetails("credit", 1000, "Credit", "1 000,00 €");
  });

  it("Add Saving account", () => {
    addAccountAndVefiryDetails("savings", 0, "Savings", "0,00 €");
  });

  it("Add Investment account", () => {
    addAccountAndVefiryDetails("investment", 0.16, "Investment", "0,16 €");
  });

  it("Add Credit account", () => {
    addAccountAndVefiryDetails(
      "credit",
      100000000000000000000,
      "Credit",
      "100 000 000 000 000 000 000,00 €"
    );
  });

  it("Add Loan account", () => {
    addAccountAndVefiryDetails("loan", 1, "Loan", "1,00 €");
  });
});
