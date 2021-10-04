describe("Expense form", () => {
  beforeEach(() => cy.visit("http://localhost:3000/statistics/expenses/add"));

  it.skip("Verify Expense name cannot be empty", () => {
    cy.get("#description").clear();
    cy.get("#amount").type("0");

    cy.get("[data-testid='submit']").click();
    cy.get("#description:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#description").invoke("prop", "required", false);
    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Name must not be empty"
    );
  });

  it("Verify Expense Amount cannot be empty", () => {
    cy.get("#description").type("irrelevant");

    cy.get("#amount").clear();

    cy.get("[data-testid='submit']").click();
    cy.get("#amount:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#amount").invoke("prop", "required", false);
    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Amount must be a number"
    );
  });

  it("Verify Expense Amount must be number", () => {
    cy.get("#description").type("irrelevant");

    cy.get("#amount").invoke("prop", "type").should("equal", "number");

    // Remove change type to able to send text value for backend
    cy.get("#amount").invoke("prop", "type", "text");
    cy.get("#amount").type("not a number");

    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Amount must be a number."
    );
  });

  it("Verify Expense Amount should accept positive values", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("100.19");
    cy.get("[data-testid='submit']").click();

    cy.location("pathname").should("eq", "/statistics/expenses");
  });

  it("Verify Expense Amount should accept zero value", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0.00");
    cy.get("[data-testid='submit']").click();

    cy.location("pathname").should("eq", "/statistics/expenses");
  });

  it.skip("Verify Expense Amount should not accept negative values", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("-1000.99");
    cy.get("[data-testid='submit']").click();
    cy.get("#amount:invalid").should("have.length", 1);

    cy.get("#amount").invoke("removeAttr", "min");
    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
  });

  it.skip("Verify Expense Date cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");

    cy.get("#date").clear();

    cy.get("[data-testid='submit']").click();
    cy.get("#date:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#date").invoke("prop", "required", false);
    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Date must not be empty."
    );
  });

  it("Verify Expense date must be date value", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");

    cy.get("#date").invoke("prop", "type").should("equal", "datetime-local");

    // Remove change type to able to send text value for backend
    cy.get("#date").invoke("prop", "type", "text");
    cy.get("#date").type("not a date");

    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Date must not be empty."
    );
  });

  it("Verify Expenses source accounts", () => {
    cy.get("#fromAccount option").should("have.length", 6);

    cy.get("#fromAccount option").contains("Saving account 1");
    cy.get("#fromAccount option").contains("Saving account 2");
    cy.get("#fromAccount option").contains("Cash account");
    cy.get("#fromAccount option").contains("Investment account");
    cy.get("#fromAccount option").contains("Credit account");
    cy.get("#fromAccount option").contains("Loan account");
  });

  it("Verify Expenses source account cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");

    cy.get("#fromAccount").invoke("val", undefined);

    cy.get("[data-testid='submit']").click();
    cy.get("#fromAccount:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#fromAccount").invoke("prop", "required", false);
    cy.get("[data-testid='submit']").click();

    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "fromAccount must not be empty."
    );
  });

  it.skip("Verify Expense target account must exists", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#fromAccount").invoke(
      "prepend",
      "<option value='not-allowed-type'>not existing account</option>"
    );
    cy.get("#fromAccount").invoke("val", "not-existing-account");

    cy.get("[data-testid='submit']").click();

    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Type must be one of the following: cash, savings, investment, credit, loan."
    );
  });

  it.skip("Test with empty form", () => {
    cy.get("#description").clear();
    cy.get("#amount").clear();
    cy.get("#date").clear();
    cy.get("#fromAccount").invoke("val", undefined);

    cy.get("[data-testid='submit']").click();
    cy.get(":invalid:not(form)").should("have.length", 3);

    // Remove form validation to test backend validation
    cy.get("#description").invoke("prop", "required", false);
    cy.get("#amount").invoke("prop", "required", false);
    cy.get("#fromAccount").invoke("prop", "required", false);

    cy.get("[data-testid='submit']").click();
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "There were 4 errors with your submission"
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Name must not be empty."
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Amount must be a number."
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "Date must not be empty."
    );
    cy.get("[data-testid='form-errors']").should(
      "contain.text",
      "fromAccount must not be empty."
    );
  });
});
