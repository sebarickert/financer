describe("Income form", () => {
  beforeEach(() => cy.visit("http://localhost:3000/statistics/transfers/add"));

  it.skip("Verify Transfer name cannot be empty", () => {
    cy.get("#description").clear();
    cy.get("#amount").type("0");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.getById("submit").click();
    cy.get("#description:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#description").invoke("prop", "required", false);
    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should("contain.text", "Name must not be empty");
  });

  it("Verify Transfer Amount cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#amount").clear();

    cy.getById("submit").click();
    cy.get("#amount:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#amount").invoke("prop", "required", false);
    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should("contain.text", "Amount must be a number");
  });

  it.skip("Verify Transfer Amount must be number", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#amount").invoke("prop", "type").should("equal", "number");

    // Remove change type to able to send text value for backend
    cy.get("#amount").invoke("prop", "type", "text");
    cy.get("#amount").type("not a number");

    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "Amount must be a number."
    );
  });

  it("Verify Transfer Amount should accept positive values", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#amount").type("100.19");
    cy.getById("submit").click();

    cy.location("pathname").should("eq", "/statistics/transfers");
  });

  it("Verify Transfer Amount should accept zero value", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#amount").type("0.00");
    cy.getById("submit").click();

    cy.location("pathname").should("eq", "/statistics/transfers");
  });

  it.skip("Verify Transfer Amount should not accept negative values", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#amount").type("-1000.99");
    cy.getById("submit").click();
    cy.get("#amount:invalid").should("have.length", 1);

    cy.get("#amount").invoke("removeAttr", "min");
    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
  });

  it.skip("Verify Transfer Date cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#date").clear();

    cy.getById("submit").click();
    cy.get("#date:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#date").invoke("prop", "required", false);
    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should("contain.text", "Date must not be empty.");
  });

  it("Verify Transfer date must be date value", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 2");

    cy.get("#date").invoke("prop", "type").should("equal", "datetime-local");

    // Remove change type to able to send text value for backend
    cy.get("#date").invoke("prop", "type", "text");
    cy.get("#date").clear();
    cy.get("#date").type("not a date");

    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should("contain.text", "Date must not be empty.");
  });

  it("Verify Transfer target accounts", () => {
    cy.get("#toAccount option").should("have.length", 6);

    cy.get("#toAccount option").contains("Saving account 1");
    cy.get("#toAccount option").contains("Saving account 2");
    cy.get("#toAccount option").contains("Cash account");
    cy.get("#toAccount option").contains("Investment account");
    cy.get("#toAccount option").contains("Credit account");
    cy.get("#toAccount option").contains("Loan account");
  });

  it("Verify Transfer target account cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");

    cy.get("#toAccount").invoke("val", undefined);

    cy.getById("submit").click();
    cy.get("#toAccount:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#toAccount").invoke("prop", "required", false);
    cy.getById("submit").click();

    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "toAccount must not be empty."
    );
  });

  it.skip("Verify Transfer target account must exists", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#toAccount").invoke(
      "prepend",
      "<option value='not-allowed-type'>not existing account</option>"
    );
    cy.get("#toAccount").invoke("val", "not-existing-account");

    cy.getById("submit").click();

    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "Type must be one of the following: cash, savings, investment, credit, loan."
    );
  });

  it("Verify Transfer target accounts", () => {
    cy.get("#fromAccount option").should("have.length", 6);

    cy.get("#fromAccount option").contains("Saving account 1");
    cy.get("#fromAccount option").contains("Saving account 2");
    cy.get("#fromAccount option").contains("Cash account");
    cy.get("#fromAccount option").contains("Investment account");
    cy.get("#fromAccount option").contains("Credit account");
    cy.get("#fromAccount option").contains("Loan account");
  });

  it("Verify Transfer target account cannot be empty", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");

    cy.get("#fromAccount").invoke("val", undefined);

    cy.getById("submit").click();
    cy.get("#fromAccount:invalid").should("have.length", 1);

    // Remove form validation to test backend validation
    cy.get("#fromAccount").invoke("prop", "required", false);
    cy.getById("submit").click();

    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "fromAccount must not be empty."
    );
  });

  it.skip("Verify Transfer target account must exists", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#fromAccount").invoke(
      "prepend",
      "<option value='not-allowed-type'>not existing account</option>"
    );
    cy.get("#fromAccount").invoke("val", "not-existing-account");

    cy.getById("submit").click();

    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "Type must be one of the following: cash, savings, investment, credit, loan."
    );
  });

  it("Verify Transfer target and source account cannot be the same account", () => {
    cy.get("#description").type("irrelevant");
    cy.get("#amount").type("0");
    cy.get("#toAccount").select("Saving account 1");
    cy.get("#fromAccount").select("Saving account 1");

    cy.getById("submit").click();

    cy.getById("form-errors").should(
      "contain.text",
      "There were 1 errors with your submission"
    );
    cy.getById("form-errors").should(
      "contain.text",
      "Target and source accounts can't be the same account."
    );
  });

  it.skip("Test with empty form", () => {
    cy.get("#description").clear();
    cy.get("#amount").clear();
    cy.get("#date").clear();
    cy.get("#toAccount").invoke("val", undefined);
    cy.get("#fromAccount").invoke("val", undefined);

    cy.getById("submit").click();
    cy.get(":invalid:not(form)").should("have.length", 5);

    // Remove form validation to test backend validation
    cy.get("#description").invoke("prop", "required", false);
    cy.get("#amount").invoke("prop", "required", false);
    cy.get("#toAccount").invoke("prop", "required", false);
    cy.get("#fromAccount").invoke("prop", "required", false);

    cy.getById("submit").click();
    cy.getById("form-errors").should(
      "contain.text",
      "There were 6 errors with your submission"
    );
    cy.getById("form-errors").should("contain.text", "Name must not be empty.");
    cy.getById("form-errors").should(
      "contain.text",
      "Amount must be a number."
    );
    cy.getById("form-errors").should("contain.text", "Date must not be empty.");
    cy.getById("form-errors").should(
      "contain.text",
      "toAccount must not be empty."
    );
    cy.getById("form-errors").should(
      "contain.text",
      "fromAccount must not be empty."
    );
    cy.getById("form-errors").should(
      "contain.text",
      "Target and source accounts can't be the same account."
    );
  });
});
