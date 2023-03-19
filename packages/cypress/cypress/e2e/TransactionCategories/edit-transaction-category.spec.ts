describe('Edit transaction category', () => {
  const editCategoryAndVerifyDetails = (
    targetCategoryName: string,
    newVisibility: string[] | null = null,
    shouldNameChange = false,
    parent: string | null = null
  ) => {
    const newName = shouldNameChange
      ? `Changed Test ${newVisibility?.join(', ') || 'invisible'} category`
      : targetCategoryName;

    cy.get(`[data-entity-title="${targetCategoryName}"]`).click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.getById('edit-transaction-category').click();

    cy.get('#name').clear();
    cy.get('#name').type(newName);

    if (newVisibility) {
      cy.getById('visibility-checkboxes').find('input').uncheck();

      newVisibility.forEach((visibilityItem) =>
        cy
          .getById('visibility-checkboxes')
          .find('label')
          .contains(visibilityItem, { matchCase: false })
          .click()
      );
      cy.saveData('targetVisibility', newVisibility);
    } else {
      cy.getById('visibility-checkboxes')
        .find('input')
        .then(($inputs) => {
          const targetVisibility: string[] = [];
          const idList: string[] = [...($inputs as never)]
            .filter((input) => (input as any).checked)
            .map((input) => (input as any).id);

          if (idList.includes('incomeVisible')) targetVisibility.push('income');
          if (idList.includes('expenseVisible'))
            targetVisibility.push('expense');
          if (idList.includes('transferVisible'))
            targetVisibility.push('transfer');

          cy.saveData('targetVisibility', targetVisibility);
        });
    }

    if (parent) {
      cy.get('#parent_category_id').select(parent);
      cy.saveData('targetParent', parent);
    } else {
      cy.get('#parent_category_id option:selected').then(($option) =>
        cy.saveData('targetParent', $option.text())
      );
    }

    cy.getById('submit').click();
    cy.location('pathname').should('not.contain', '/edit');

    // TODO: This is a workaround to give react time refetch content instead of showing cached list
    // to fix we have to implement new loader logic by checking if react-query is loading

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.get(`[data-entity-title="${newName}"]`).click();

    cy.getById('edit-transaction-category').click();

    cy.location('pathname').should('contain', '/edit');

    cy.get('#name').should('have.value', newName);

    cy.get<string[]>('@targetVisibility').then((targetVisibility) => {
      cy.getById('visibility-checkboxes')
        .find('#incomeVisible')
        .should(
          targetVisibility?.includes('income') ? 'be.checked' : 'not.be.checked'
        );
      cy.getById('visibility-checkboxes')
        .find('#expenseVisible')
        .should(
          targetVisibility?.includes('expense')
            ? 'be.checked'
            : 'not.be.checked'
        );
      cy.getById('visibility-checkboxes')
        .find('#transferVisible')
        .should(
          targetVisibility?.includes('transfer')
            ? 'be.checked'
            : 'not.be.checked'
        );
    });

    cy.get<string[]>('@targetParent').then((targetParent) => {
      cy.get('#parent_category_id option:selected').should(
        'have.text',
        targetParent
      );
    });
  };

  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/profile/transaction-categories');
  });

  it('Change category name', () => {
    editCategoryAndVerifyDetails('Income sub category', null, true);
  });

  it('Remove category visibility', () => {
    editCategoryAndVerifyDetails('Category for all types', [], false);
  });

  it('Add category all visibility types', () => {
    editCategoryAndVerifyDetails(
      'Invisible category',
      ['income', 'expense', 'transfer'],
      false
    );
  });

  it('Unlink from parent category', () => {
    editCategoryAndVerifyDetails('Expense sub category', null, false, 'None');
  });

  it('Add parent for category', () => {
    editCategoryAndVerifyDetails(
      'Invisible category',
      null,
      false,
      'Category for all types'
    );
  });

  it('Change category parent', () => {
    editCategoryAndVerifyDetails(
      'Income sub category',
      null,
      false,
      'Income category'
    );
  });

  it('Change all field', () => {
    editCategoryAndVerifyDetails(
      'Expense sub category',
      ['income'],
      true,
      'Transfer category'
    );
  });
});
