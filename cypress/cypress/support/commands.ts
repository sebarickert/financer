// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
    interface Chainable {
        getById(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<Element>>
    }
}

Cypress.Commands.add('getById', (selector, ...args) => {
    return cy.get(`[data-testid=${selector}]`, ...args)
  })
  
  