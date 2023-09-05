describe('Edit income with category', () => {
  beforeEach(() => {
    cy.applyFixture('small');
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  it('Edit with single category', () => {
    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de1f2c839cf72d59b0d91').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Category for all types');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_category'
    ).select('Invisible category > Sub category for all types');

    cy.getByTestId('transaction-categories-form_transaction-category_amount')
      .should('contain.value', '2222')
      .clear()
      .type('50.50');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_description'
    )
      .should('contain.value', 'dummy description')
      .clear();

    cy.getByTestId('submit').click();

    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de1f2c839cf72d59b0d91').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should(
        'contain.text',
        'Invisible category > Sub category for all types'
      );
    cy.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '50.5');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', '');
  });

  it('Delete one categories with multiple categories', () => {
    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de213c839cf72d59b0da6').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .then(($options) => {
        expect($options[0].innerHTML).to.equal('Income category');
        expect($options[1].innerHTML).to.equal('Category for all types');
      });

    cy.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    ).then(($inputs) => {
      expect($inputs[0]).to.have.value('222');
      // expect($inputs[1]).to.have.value('34564532');

      cy.wrap($inputs[0]).clear().type('100');
    });

    cy.getByTestId(
      'transaction-categories-form_transaction-category_description'
    ).then(($inputs) => {
      expect($inputs[0]).to.have.value('dummy description');
      expect($inputs[1]).to.have.value('not so dummy description');

      cy.wrap($inputs[0]).clear().type('Changed description');
    });

    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('have.length', 2);
    cy.getByTestId('transaction-categories-form_delete-button').then(
      ($buttons) => cy.wrap($buttons[1]).click()
    );
    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('have.length', 1);

    cy.getByTestId('submit').click();

    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de213c839cf72d59b0da6').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('have.length', 1);
    cy.getByTestId('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Income category');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '100');
    cy.getByTestId(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', 'Changed description');
  });
  it('Delete all categories with multiple categories', () => {
    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de213c839cf72d59b0da6').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('have.length', 2);

    cy.getByTestId('transaction-categories-form_delete-button').first().click();
    cy.getByTestId('transaction-categories-form_delete-button').click();

    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('not.exist');

    cy.getByTestId('submit').click();

    cy.visit('http://localhost:3000/statistics/incomes?date=2022-03&page=1');
    cy.getByTestId('623de213c839cf72d59b0da6').click();
    cy.getByTestId('edit-income-button').click();

    cy.getByTestId(
      'transaction-categories-form_transaction-category_row'
    ).should('not.exist');
  });
});
