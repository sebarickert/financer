describe('Account deleting', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/accounts');
  });

  it('Should delete account', () => {
    cy.getById('account-row')
      .contains('Saving account 2')
      .should('have.length', 1);
    cy.getById('account-row').contains('Saving account 2').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.getById('delete-account').click();
    cy.getById('delete-account_confirm-button').click();

    cy.getById('account-row').should('not.contain.text', 'Saving account 2');
  });

  it('Should not delete account on modal cancel', () => {
    cy.getById('account-row')
      .contains('Saving account 2')
      .should('have.length', 1);
    cy.getById('account-row').contains('Saving account 2').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.getById('delete-account').click();
    cy.getById('delete-account_cancel-button').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.getById('header-back-link').click();

    cy.getById('account-row').should('contain.text', 'Saving account 2');
  });
});
