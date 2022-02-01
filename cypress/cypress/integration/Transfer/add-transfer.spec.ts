import {
  formatDate,
} from "../apiHelpers";

describe("Add transfer", () => {
  beforeEach(() => cy.visit("http://localhost:3000/statistics/transfers"));
  const newTransactionAmountStr = "15.50";
  const newTransactionName = "new dummy transaction created by test code";

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
