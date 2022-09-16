describe('Edit expense with category', () => {
  beforeEach(() => {
    cy.applyFixture('small');
    cy.visit('http://localhost:3000/statistics/expenses');
  });

  it('Edit with single category', () => {
    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de25fc839cf72d59b0dbd').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should(
        'contain.text',
        'Invisible category > Sub category for all types'
      );
    cy.getById(
      'transaction-categories-form_transaction-category_category'
    ).select('Category for all types');

    cy.getById('transaction-categories-form_transaction-category_amount')
      .should('contain.value', '22222')
      .clear()
      .type('50.50');
    cy.getById('transaction-categories-form_transaction-category_description')
      .should('contain.value', 'dummy description')
      .clear();

    cy.getById('submit').click();

    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de25fc839cf72d59b0dbd').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Category for all types');
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '50.5');
    cy.getById(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', '');
  });

  it('Delete one categories with multiple categories', () => {
    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de288c839cf72d59b0dd2').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .then(($options) => {
        expect($options[0].innerHTML).to.equal('Expense category');
        expect($options[1].innerHTML).to.equal(
          'Invisible category &gt; Expense sub category'
        );
      });

    cy.getById('transaction-categories-form_transaction-category_amount').then(
      ($inputs) => {
        expect($inputs[0]).to.have.value('3333');
        // expect($inputs[1]).to.have.value('34564532');

        cy.wrap($inputs[0]).clear().type('100');
      }
    );

    cy.getById(
      'transaction-categories-form_transaction-category_description'
    ).then(($inputs) => {
      expect($inputs[0]).to.have.value('dummy description');
      expect($inputs[1]).to.have.value('not so dummy description');

      cy.wrap($inputs[0]).clear().type('Changed description');
    });

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      2
    );
    cy.getById('transaction-categories-form_delete-button').then(($buttons) =>
      cy.wrap($buttons[1]).click()
    );
    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      1
    );

    cy.getById('submit').click();

    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de288c839cf72d59b0dd2').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      1
    );
    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Expense category');
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '100');
    cy.getById(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', 'Changed description');
  });

  it('Delete all categories with multiple categories', () => {
    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de288c839cf72d59b0dd2').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      2
    );

    cy.getById('transaction-categories-form_delete-button').click({
      multiple: true,
      force: true,
    });

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'not.exist'
    );

    cy.getById('submit').click();

    cy.visit('http://localhost:3000/statistics/expenses/2022-03');
    cy.getById('623de288c839cf72d59b0dd2').click();
    cy.getById('edit-expense-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'not.exist'
    );
  });
});
