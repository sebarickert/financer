describe('Transaction category form', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/profile/transaction-categories/add');
  });

  it('Should not allow set child category as parent', () => {
    cy.visit(
      'http://localhost:3000/profile/transaction-categories/623b58ada3deba9879422fbf/edit'
    );

    const categoryName = 'Category for all types';
    const childCategoryId = '623b6b84a3deba9879422fdd';

    // Verify that we have correct category
    cy.get('#name').should('have.value', categoryName);

    cy.get('#parentTransactionCategory option').should(
      'not.contain.text',
      categoryName
    );

    cy.get('#parentTransactionCategory').then(($select) => {
      $select.append(
        `<option value="${childCategoryId}">child-category</option>`
      );
    });
    cy.get('#parentTransactionCategory').select('child-category');

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should(
      'contain.text',
      'Parent category cannot be child category of current item.'
    );
  });
});
