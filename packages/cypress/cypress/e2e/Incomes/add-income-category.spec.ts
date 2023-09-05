describe('Add income with category', () => {
  const INCOME_NAME = 'Test income';
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/statistics/incomes/add');

    cy.get('#description').clear().type(INCOME_NAME);
    cy.get('#amount').clear().type('10000.50');
    cy.getByTestId('add-category-button').click();
  });

  it('Add income with category', () => {
    cy.getByTestId('transaction-categories-form_transaction-category_amount')
      .clear()
      .type('50');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_category'
    ).select('Category for all types');

    cy.getByTestId('submit').click();

    cy.location('pathname').should('not.contain', '/add');
    cy.contains(INCOME_NAME).click();

    cy.getByTestId('category_label').should(
      'contain.text',
      'Category for all types'
    );
    cy.getByTestId('category_amount').should('contain.text', '50,00');
  });

  it('Verify selected category must exists', () => {
    cy.getByTestId('transaction-categories-form_transaction-category_amount')
      .clear()
      .type('50');
    cy.getByTestId('transaction-categories-form_transaction-category_category')
      .then(($select) => {
        $select.append(
          '<option value="123456789012345678901234">non-existing-category</option>'
        );
      })
      .select('non-existing-category');

    cy.getByTestId('submit').click();

    cy.getByTestId('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getByTestId('form-errors').should(
      'contain.text',
      'One or more categories does not exist.'
    );
  });
});
