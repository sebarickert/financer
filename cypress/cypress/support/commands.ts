// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getById(
      selector: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<JQuery<Element>>;

    saveAsyncData(
      variableName: string,
      fetchFunction: () => Promise<unknown>
    ): void;

    saveData(variableName: string, data: unknown): void;
  }
}

Cypress.Commands.add('getById', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add(
  'saveAsyncData',
  (variableName: string, fetchFunction: () => Promise<unknown>) =>
    cy.wrap(null).then(async () => {
      cy.wrap(await fetchFunction()).as(variableName);
    })
);

Cypress.Commands.add('saveData', (variableName: string, data: unknown) =>
  cy.wrap(null).then(async () => {
    cy.wrap(data).as(variableName);
  })
);
