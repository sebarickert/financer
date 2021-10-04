it("Add latest income", function () {
  cy.visit("http://localhost:3000/statistics/incomes");
  cy.get("[data-testid=add-income]").click();
  cy.get("#description").clear();
  cy.get("#description").type("irrelevant");
  cy.get("#amount").clear();
  cy.get("#amount").type("10");
  cy.get("[data-testid=submit]").click();
});
