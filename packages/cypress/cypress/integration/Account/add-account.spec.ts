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
    cy.getById('account-row').should('not.have.text', newAccountName);

    cy.getById('add-account').click();

    // Add account form
    cy.get('#account').clear();
    cy.get('#account').type(newAccountName);
    cy.get('#amount').clear();
    cy.get('#amount').type(accountBalance);
    cy.get('#type').select(accountType);
    cy.getById('submit').click();

    cy.contains(newAccountName).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);

    cy.getById('account-type').should('have.text', expectedType);
    cy.getById('account-balance')
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
