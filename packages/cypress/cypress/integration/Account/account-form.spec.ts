describe('Account form', () => {
  beforeEach(() => {
    cy.applyFixture('empty');
    cy.visit('http://localhost:3000/accounts/add');
  });

  it('Verify Account name cannot be empty', () => {
    cy.get('#account').clear();
    cy.get('#amount').type('0');

    cy.getById('submit').click();
    cy.get('#account:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#account').invoke('prop', 'required', false);
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Name must not be empty');
  });

  it('Verify Account Balance cannot be empty', () => {
    cy.get('#account').type('irrelevant');

    cy.get('#amount').clear();

    cy.getById('submit').click();
    cy.get('#amount:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#amount').invoke('prop', 'required', false);
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Balance must be a number'
    );
  });

  it('Verify Account Balance must be number', () => {
    cy.get('#account').type('irrelevant');

    cy.get('#amount').invoke('prop', 'type').should('equal', 'number');

    // Remove change type to able to send text value for backend
    cy.get('#amount').invoke('prop', 'type', 'text');
    cy.get('#amount').type('not a number');

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Balance must be a number.'
    );
  });

  it('Verify Account Balance should accept positive values', () => {
    cy.get('#account').type('irrelevant');
    cy.get('#amount').type('100.19');
    cy.getById('submit').click();

    cy.location('pathname').should('eq', '/accounts');
  });

  it('Verify Account Balance should accept zero value', () => {
    cy.get('#account').type('irrelevant');
    cy.get('#amount').type('0.00');
    cy.getById('submit').click();

    cy.location('pathname').should('eq', '/accounts');
  });

  it('Verify Account Balance should accept negative values', () => {
    cy.get('#account').type('irrelevant');
    cy.get('#amount').type('-1000.99');
    cy.getById('submit').click();

    cy.location('pathname').should('eq', '/accounts');
  });

  it('Verify Accounts types', () => {
    cy.get('#type option').should('have.length', 5);

    cy.get('#type option').contains('Savings').should('have.value', 'savings');
    cy.get('#type option').contains('Cash').should('have.value', 'cash');
    cy.get('#type option')
      .contains('Investment')
      .should('have.value', 'investment');
    cy.get('#type option').contains('Credit').should('have.value', 'credit');
    cy.get('#type option').contains('Loan').should('have.value', 'loan');
  });

  it('Verify Accounts type cannot be empty', () => {
    cy.get('#account').type('irrelevant');
    cy.get('#amount').type('0');

    cy.get('#type').invoke('val', undefined);

    cy.getById('submit').click();
    cy.get('#type:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#type').invoke('prop', 'required', false);
    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Type must be one of the following: cash, savings, investment, credit, loan.'
    );
  });

  it('Verify Accounts type allow only defined values', () => {
    cy.get('#account').type('irrelevant');
    cy.get('#amount').type('0');
    cy.get('#type').invoke(
      'prepend',
      "<option value='not-allowed-type'>not allowed type</option>"
    );
    cy.get('#type').invoke('val', 'not-allowed-type');

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Type must be one of the following: cash, savings, investment, credit, loan.'
    );
  });

  it('Test with empty form', () => {
    cy.get('#account').clear();
    cy.get('#amount').clear();
    cy.get('#type').invoke('val', undefined);

    cy.getById('submit').click();
    cy.get(':invalid:not(form)').should('have.length', 3);

    // Remove form validation to test backend validation
    cy.get('#account').invoke('prop', 'required', false);
    cy.get('#amount').invoke('prop', 'required', false);
    cy.get('#type').invoke('prop', 'required', false);

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 3 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Name must not be empty.');
    cy.getById('form-errors').should(
      'contain.text',
      'Type must be one of the following: cash, savings, investment, credit, loan.'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Balance must be a number.'
    );
  });
});
