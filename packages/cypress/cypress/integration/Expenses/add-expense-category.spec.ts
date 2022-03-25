describe('Add expense with category', () => {
  const EXPENSE_NAME = 'Test expense';
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/statistics/expenses/add');

    cy.get('#description').clear().type(EXPENSE_NAME);
    cy.get('#amount').clear().type('10000.50');
    cy.getById('add-category-button').click();
  });

  it('Add expense with category', () => {
    cy.getById('transaction-categories-form_transaction-category_amount')
      .clear()
      .type('50');
    cy.getById(
      'transaction-categories-form_transaction-category_category'
    ).select('Category for all types');

    cy.getById('submit').click();

    cy.location('pathname').should('not.contain', '/add');
    cy.contains(EXPENSE_NAME).click();

    cy.getById('categories-wrapper_list-header').should(
      'contain.text',
      'Categories'
    );
    cy.getById('category-row').should('have.length', 1);
    cy.getById('category-row_label').should(
      'contain.text',
      'Category for all types'
    );
    cy.getById('category-row_content').should('contain.text', '50,00');
  });

  it('Verify selected category must exists', () => {
    cy.getById('transaction-categories-form_transaction-category_amount')
      .clear()
      .type('50');
    cy.getById('transaction-categories-form_transaction-category_category')
      .then(($select) => {
        $select.append(
          '<option value="123456789012345678901234">non-existing-category</option>'
        );
      })
      .select('non-existing-category');

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'One or more categories does not exist.'
    );
  });

  it('Verify amount cannot be empty', () => {
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).clear();
    cy.getById(
      'transaction-categories-form_transaction-category_category'
    ).select('Category for all types');

    cy.getById('submit').click();

    cy.get(':invalid:not(form)').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).invoke('prop', 'required', false);

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'categories.0.Amount must be a positive number.'
    );
  });

  it('Verify amount cannot be zero', () => {
    cy.getById('transaction-categories-form_transaction-category_amount')
      .clear()
      .type('0');
    cy.getById(
      'transaction-categories-form_transaction-category_category'
    ).select('Category for all types');

    cy.getById('submit').click();

    cy.get(':invalid:not(form)').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).invoke('prop', 'min', false);

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'categories.0.Amount must be a positive number.'
    );
  });
});
