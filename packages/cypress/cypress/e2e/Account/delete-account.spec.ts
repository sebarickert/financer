describe('Account deleting', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/accounts');
  });

  it('Should delete account', () => {
    cy.getByTestId('account-row')
      .contains('Saving account 2')
      .should('have.length', 1);
    cy.getByTestId('account-row').contains('Saving account 2').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);

    cy.getByTestId('delete-account').click();
    cy.getByTestId('delete-account_confirm-button').click();

    cy.getByTestId('account-row').should(
      'not.contain.text',
      'Saving account 2'
    );
  });

  it('Should not delete account on modal cancel', () => {
    cy.getByTestId('account-row')
      .contains('Saving account 2')
      .should('have.length', 1);
    cy.getByTestId('account-row').contains('Saving account 2').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);

    cy.getByTestId('delete-account').click();
    cy.getByTestId('delete-account_cancel-button').click();

    cy.getByTestId('header-back-link').click();

    cy.getByTestId('account-row').should('contain.text', 'Saving account 2');
  });
});
