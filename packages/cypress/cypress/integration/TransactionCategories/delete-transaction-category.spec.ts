describe('Delete transaction category', () => {
  const deleteAndVerifyTransactionCategory = (targetCategoryName: string) => {
    cy.contains(targetCategoryName).should('have.length', 1);

    cy.contains(targetCategoryName).parents('article').contains('Edit').click();

    cy.getById('delete-transaction-category-modal_open-button').click();
    cy.getById('delete-transaction-category-modal_confirm-button').click();

    cy.contains(targetCategoryName).should('not.exist');
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
