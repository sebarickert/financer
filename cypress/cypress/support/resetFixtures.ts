/* eslint-disable @typescript-eslint/no-namespace */
declare namespace Cypress {
  interface Chainable {
    applyFixture(
      fixtureType: "large" | "small" | "empty" | "accounts-only"
    ): void;
  }
}

Cypress.Commands.add("applyFixture", (fixtureType) => {
  cy.fixture(`${fixtureType}_fixture-data.json`).then(
    { timeout: 10000 },
    (fixture) =>
      fetch("http://localhost:3000/api/profile/my-data", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fixture),
      })
  );
});
