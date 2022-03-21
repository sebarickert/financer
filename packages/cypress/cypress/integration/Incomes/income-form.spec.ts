describe('Income form', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/statistics/incomes/add');
  });

  it('Verify Income description cannot be empty', () => {
    cy.get('#description').clear();
    cy.get('#amount').type('1');

    cy.getById('submit').click();
    cy.get('#description:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#description').invoke('prop', 'required', false);
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Description must not be empty.'
    );
  });

  it('Verify Income Amount cannot be empty', () => {
    cy.get('#description').type('irrelevant');

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
      'Amount must be a positive number.'
    );
  });

  it('Verify Income Amount must be number', () => {
    cy.get('#description').type('irrelevant');

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
      'Amount must be a positive number.'
    );
  });

  it('Verify Income Amount should accept positive values', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('100.19');
    cy.getById('submit').click();

    cy.location('pathname').should('eq', '/statistics/incomes');
  });

  it('Verify Income Amount should not accept zero value', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('0.00');
    cy.getById('submit').click();
    cy.get('#amount:invalid').should('have.length', 1);

    cy.get('#amount').invoke('removeAttr', 'min');
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Amount must be a positive number.'
    );
  });

  it('Verify Income Amount should not accept negative values', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('-1000.99');
    cy.getById('submit').click();
    cy.get('#amount:invalid').should('have.length', 1);

    cy.get('#amount').invoke('removeAttr', 'min');
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Amount must be a positive number.'
    );
  });

  it('Verify Income Date cannot be empty', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('1');

    cy.get('#date').clear();

    // Remove form validation to test backend validation
    cy.get('#date').invoke('prop', 'required', false);
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Date must not be empty.');
  });

  it('Verify Income date must be date value', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('1');

    cy.get('#date').invoke('prop', 'type').should('equal', 'datetime-local');

    // Remove change type to able to send text value for backend
    cy.get('#date').invoke('prop', 'type', 'text');
    cy.get('#date').clear();
    cy.get('#date').type('not a date');

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Date must not be empty.');
  });

  it('Verify Incomes target accounts', () => {
    cy.get('#toAccount option').should('have.length', 6);

    cy.get('#toAccount option').contains('Saving account 1');
    cy.get('#toAccount option').contains('Saving account 2');
    cy.get('#toAccount option').contains('Cash account');
    cy.get('#toAccount option').contains('Investment account');
    cy.get('#toAccount option').contains('Credit account');
    cy.get('#toAccount option').contains('Loan account');
  });

  it('Verify Incomes target account cannot be empty', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('1');

    cy.get('#toAccount').invoke('val', undefined);

    cy.getById('submit').click();
    cy.get('#toAccount:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#toAccount').invoke('prop', 'required', false);
    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'toAccount must not be empty.'
    );
  });

  it('Verify Incomes target account must exists', () => {
    cy.get('#description').type('irrelevant');
    cy.get('#amount').type('1');
    cy.get('#toAccount').then(($select) => {
      $select.append(
        '<option value="123456789012345678901234">non-existing-account</option>'
      );
    });
    cy.get('#toAccount').select('non-existing-account');

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Account not found.');
  });

  it('Test with empty form', () => {
    cy.get('#description').clear();
    cy.get('#amount').clear();
    cy.get('#date').clear();
    cy.get('#toAccount').invoke('val', undefined);

    cy.getById('submit').click();
    cy.get(':invalid:not(form)').should('have.length', 3);

    // Remove form validation to test backend validation
    cy.get('#description').invoke('prop', 'required', false);
    cy.get('#amount').invoke('prop', 'required', false);
    cy.get('#toAccount').invoke('prop', 'required', false);

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 4 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Description must not be empty.'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Amount must be a positive number.'
    );
    cy.getById('form-errors').should('contain.text', 'Date must not be empty.');
    cy.getById('form-errors').should(
      'contain.text',
      'toAccount must not be empty.'
    );
  });
});
