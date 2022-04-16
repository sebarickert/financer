describe('Edit income with category', () => {
  beforeEach(() => {
    cy.applyFixture('small');
    cy.visit('http://localhost:3000/statistics/incomes');
  });

  it('Edit with single category', () => {
    cy.getById('623de1f2c839cf72d59b0d91').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Category for all types');
    cy.getById(
      'transaction-categories-form_transaction-category_category'
    ).select('Invisible category > Sub category for all types');

    cy.getById('transaction-categories-form_transaction-category_amount')
      .should('contain.value', '2222')
      .clear()
      .type('50.50');
    cy.getById('transaction-categories-form_transaction-category_description')
      .should('contain.value', 'dummy description')
      .clear();

    cy.getById('submit').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('623de1f2c839cf72d59b0d91').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should(
        'contain.text',
        'Invisible category > Sub category for all types'
      );
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '50.5');
    cy.getById(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', '');
  });

  it('Delete one categories with multiple categories', () => {
    cy.getById('623de213c839cf72d59b0da6').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .then(($options) => {
        expect($options[0].innerHTML).to.equal('Income category');
        expect($options[1].innerHTML).to.equal('Category for all types');
      });

    cy.getById('transaction-categories-form_transaction-category_amount').then(
      ($inputs) => {
        expect($inputs[0]).to.have.value('222');
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

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('623de213c839cf72d59b0da6').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      1
    );
    cy.getById('transaction-categories-form_transaction-category_category')
      .find('option:selected')
      .should('contain.text', 'Income category');
    cy.getById(
      'transaction-categories-form_transaction-category_amount'
    ).should('contain.value', '100');
    cy.getById(
      'transaction-categories-form_transaction-category_description'
    ).should('contain.value', 'Changed description');
  });
  it('Delete all categories with multiple categories', () => {
    cy.getById('623de213c839cf72d59b0da6').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'have.length',
      2
    );

    cy.getById('transaction-categories-form_delete-button').click({
      multiple: true,
      force: true,
    });
    cy.getById('transaction-categories-form_delete-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'not.exist'
    );

    cy.getById('submit').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('623de213c839cf72d59b0da6').click();
    cy.getById('edit-income-button').click();

    cy.getById('transaction-categories-form_transaction-category_row').should(
      'not.exist'
    );
  });
});
