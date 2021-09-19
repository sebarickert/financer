describe("Basic account flow", () => {
  beforeEach(() => cy.visit("http://localhost:3000/accounts"));

  it("Verify accounts in fixture", () => {
    cy.get('[data-test-id="account-row"').should("have.length", 6);
  });

  it("Add new account", () => {
    cy.get('[data-test-id="account-row"').should(
      "not.have.text",
      "New Test Account"
    );

    cy.get('[data-test-id="add-account"]').click();
    cy.get("#account").clear();
    cy.get("#account").type("New Test Account");
    cy.get("#amount").clear();
    cy.get("#amount").type("1000");
    cy.get("#type").select("credit");
    cy.get(":nth-child(1) > .inline-flex").click();

    cy.get('[data-test-id="account-row"]').should("have.length", 7);
    cy.get('[data-test-id="account-row"]').contains("New Test Account").click();

    expect(cy.get('[data-test-id="balance"] > dd').contains("1 000,00 €")).to
      .exist;
    cy.get('[data-test-id="type"] > dd').should("have.text", "Credit");
  });
});
