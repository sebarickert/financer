describe('Account creation', () => {
  before(() => {
    cy.applyFixture('accounts-only');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/accounts');
  });

  const addAccountAndVerifyDetails = (
    accountType,
    accountBalance,
    expectedType,
    expextedBalance
  ) => {
    const newAccountName = `New Test ${expectedType} Account ${Math.random()}`;
    cy.getByTestId('account-row').should('not.have.text', newAccountName);

    cy.getByTestId('add-account').click();

    // Add account form
    cy.get('#name').clear();
    cy.get('#name').type(newAccountName);
    cy.get('#balance').clear();
    cy.get('#balance').type(accountBalance);
    cy.get('#type').select(accountType);
    cy.getByTestId('submit').click();

    cy.location('pathname').should('match', /\/accounts\/?$/);

    cy.contains(newAccountName).click();

    cy.location('pathname').should('not.match', /\/accounts\/?$/);

    cy.getByTestId('account-type').should('have.text', expectedType);
    cy.getByTestId('account-balance')
      .invoke('text')
      .invoke('replace', /\u00a0/g, ' ')
      .should('equal', expextedBalance);
  };

  it('Add Cash account', () => {
    addAccountAndVerifyDetails('credit', 1000, 'Credit', '1 000,00 €');
  });

  it('Add Saving account', () => {
    addAccountAndVerifyDetails('savings', 0, 'Savings', '0,00 €');
  });

  it('Add Investment account', () => {
    addAccountAndVerifyDetails('investment', 0.16, 'Investment', '0,16 €');
  });

  it('Add Credit account', () => {
    addAccountAndVerifyDetails(
      'credit',
      100000000000000000000,
      'Credit',
      '100 000 000 000 000 000 000,00 €'
    );
  });

  it('Add Loan account', () => {
    addAccountAndVerifyDetails('loan', 1, 'Loan', '1,00 €');
  });
});
