describe('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = (targetCategoryName: string) => {
    cy.contains(targetCategoryName).should('have.length', 1);

    cy.get(`[data-entity-title="${targetCategoryName}"]`).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.getById('delete-transaction-category').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.getById('delete-transaction-category_confirm-button').click();

    cy.get(`[data-entity-title="${targetCategoryName}"]`).should('not.exist');
  };

  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/profile/transaction-categories');
  });

  it('Delete category without parent/childs', () => {
    deleteAndVerifyTransactionCategory('Income category');
  });

  it('Delete category with parent', () => {
    deleteAndVerifyTransactionCategory('Income sub category');
  });

  it('Delete category with childs', () => {
    deleteAndVerifyTransactionCategory('Category for all types');
  });
});
