describe('Transaction categories visibility in transaction forms', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
  });

  const verifyIncomeCategories = () =>
    cy
      .getById('transaction-categories-form_transaction-category_category')
      .find('option')
      .should('have.length', 4)
      .should('contain', 'Category for all types')
      .should('contain', 'Income category')
      .should('contain', 'Income sub category')
      .should('contain', 'Sub category for all types');

  const verifyExpenseCategories = () =>
    cy
      .getById('transaction-categories-form_transaction-category_category')
      .find('option')
      .should('have.length', 4)
      .should('contain', 'Category for all types')
      .should('contain', 'Expense category')
      .should('contain', 'Expense sub category')
      .should('contain', 'Sub category for all types');

  const verifyTransferCategories = () =>
    cy
      .getById('transaction-categories-form_transaction-category_category')
      .find('option')
      .should('have.length', 4)
      .should('contain', 'Category for all types')
      .should('contain', 'Transfer category')
      .should('contain', 'Transfer sub category')
      .should('contain', 'Sub category for all types');

  it('Verify add income categories', () => {
    cy.visit('http://localhost:3000/statistics/incomes/add');
    cy.get('#amount').clear().type('100');

    cy.getById('add-category-button').click();
    verifyIncomeCategories();
  });

  it('Verify add expense categories', () => {
    cy.visit('http://localhost:3000/statistics/expenses/add');
    cy.get('#amount').clear().type('100');

    cy.getById('add-category-button').click();
    verifyExpenseCategories();
  });

  it('Verify add transfer categories', () => {
    cy.visit('http://localhost:3000/statistics/transfers/add');
    cy.get('#amount').clear().type('100');

    cy.getById('add-category-button').click();
    verifyTransferCategories();
  });
});
