describe('Transaction category form', () => {
  beforeEach(() => {
    cy.applyFixture('empty');
    cy.visit('http://localhost:3000/profile/transaction-categories/add');
  });

  it('Verify category name cannot be empty', () => {
    cy.get('#name').clear();

    cy.getById('submit').click();
    cy.get('#name:invalid').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#name').invoke('prop', 'required', false);
    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Name must not be empty.');
  });

  it('Verify category visibility options', () => {
    cy.getById('visibility-checkboxes').find('input').should('have.length', 3);

    cy.get(`[data-testid=visibility-checkboxes]`)
      .find('input')
      .then(($checkboxes) => {
        console.log($checkboxes);
        const expextedIds = [
          'incomeVisible',
          'expenseVisible',
          'transferVisible',
        ];
        [...($checkboxes as never as JQuery<HTMLInputElement>[])].forEach(
          ($checkbox, index) =>
            cy.wrap($checkbox).should('have.id', expextedIds[index])
        );
      });
  });

  it('Verify category visibility options allow only defined values', () => {
    const newCategory = async () =>
      (
        await fetch('http://localhost:3000/api/transaction-categories', {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            name: 'irrelevant',
            parent_category_id: null,
            visibility: ['illegal-type'],
          }),
          method: 'POST',
        })
      ).json();

    cy.saveAsyncData('newCategory', newCategory);

    cy.get('@newCategory').then((data) => {
      console.log(data);
      expect(data).to.deep.equal({
        statusCode: 400,
        message: [
          'Visibility must be one of the following: income, expense, transfer.',
        ],
        error: 'Bad Request',
      });
    });
  });

  it('Verify category visibility options allow all defined values', () => {
    cy.get('#name').clear();
    cy.get('#name').type('irrelevant');
    cy.get('#incomeVisible').check();
    cy.get('#expenseVisible').check();
    cy.get('#transferVisible').check();
    cy.getById('submit').click();
  });

  it('Verify parent category must exists', () => {
    cy.get('#name').clear();
    cy.get('#name').type('irrelevant');

    cy.get('#parentTransactionCategory').then(($select) => {
      $select.append(
        '<option value="123456789012345678901234">non-existing-category</option>'
      );
    });
    cy.get('#parentTransactionCategory').select('non-existing-category');

    cy.getById('submit').click();

    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Category not found.');
  });

  it('Test with empty form', () => {
    cy.get('#name').clear();

    cy.getById('submit').click();
    cy.get(':invalid:not(form)').should('have.length', 1);

    // Remove form validation to test backend validation
    cy.get('#name').invoke('prop', 'required', false);

    cy.getById('submit').click();
    cy.getById('form-errors').should(
      'contain.text',
      'There were 1 errors with your submission'
    );
    cy.getById('form-errors').should('contain.text', 'Name must not be empty.');
  });

  it('Should not allow set child category as parent', () => {
    cy.applyFixture('accounts-only');
    cy.visit(
      'http://localhost:3000/profile/transaction-categories/623b58ada3deba9879422fbf/edit'
    );

    const categoryName = 'Category for all types';
    const childCategoryId = '623b6b84a3deba9879422fdd';

    // Verify that we have correct category
    cy.get('#name').should('have.value', categoryName);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
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
