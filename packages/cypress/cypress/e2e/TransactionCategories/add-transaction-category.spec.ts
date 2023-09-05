describe('Transaction category creation', () => {
  const addCategoryAndVerifyDetails = (
    visibility: string[] = [],
    parent = 'None'
  ) => {
    const newName = `New Test ${visibility.join(', ') || 'invisible'} category`;

    cy.getByTestId('category-parent-row').should('not.have.text', newName);
    cy.getByTestId('category-child-row').should('not.have.text', newName);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);

    cy.getByTestId('add-category').click();

    cy.get('#name').clear();
    cy.get('#name').type(newName);

    visibility.forEach((visibilityItem) =>
      cy
        .getByTestId('visibility-checkboxes')
        .find('label')
        .contains(visibilityItem, { matchCase: false })
        .click()
    );

    cy.get('#parent_category_id').select(parent);

    cy.getByTestId('submit').click();
    cy.location('pathname').should('not.contain', '/add');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.contains(newName).click();

    cy.getByTestId('edit-transaction-category').click();

    cy.get('#name').should('have.value', newName);

    cy.getByTestId('visibility-checkboxes')
      .find('#incomeVisible')
      .should(visibility.includes('income') ? 'be.checked' : 'not.be.checked');
    cy.getByTestId('visibility-checkboxes')
      .find('#expenseVisible')
      .should(visibility.includes('expense') ? 'be.checked' : 'not.be.checked');
    cy.getByTestId('visibility-checkboxes')
      .find('#transferVisible')
      .should(
        visibility.includes('transfer') ? 'be.checked' : 'not.be.checked'
      );

    cy.get('#parent_category_id option').should('not.contain.text', newName);

    cy.get('#parent_category_id').then(($select) => {
      const selectedValue = $select.val();
      cy.wrap($select)
        .get(`option[value="${selectedValue}"]`)
        .should('have.text', parent);
    });
  };

  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/profile/transaction-categories');
  });

  it('Verify category in fixture', () => {
    cy.getByTestId('category-parent-row').should('have.length', 3);
    cy.getByTestId('category-child-row').should('have.length', 8);
  });

  it('Add category without visibility options and without parent', () => {
    addCategoryAndVerifyDetails([]);
  });

  it('Add category with expense visibility', () => {
    addCategoryAndVerifyDetails(['expense']);
  });

  it('Add category with income visibility', () => {
    addCategoryAndVerifyDetails(['income']);
  });

  it('Add category with transfer visibility', () => {
    addCategoryAndVerifyDetails(['transfer']);
  });

  it('Add category with two visibilities', () => {
    addCategoryAndVerifyDetails(['income', 'transfer']);
  });

  it('Add category with all visibilities', () => {
    addCategoryAndVerifyDetails(['income', 'expense', 'transfer']);
  });

  it('Add category with all visibilities and parent', () => {
    addCategoryAndVerifyDetails(
      ['income', 'expense', 'transfer'],
      'Invisible category'
    );
  });

  it('Add category without visibility options and without parent', () => {
    addCategoryAndVerifyDetails([], 'Category for all types');
  });
});
