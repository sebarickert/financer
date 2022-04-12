describe('Account editing', () => {
  beforeEach(() => {
    cy.applyFixture('accounts-only');
    cy.visit('http://localhost:3000/accounts');
  });

  const parseFloatFromText = (text: string) => {
    return parseFloat(
      text
        .replace(',', '.')
        .replace(/\u00a0/g, ' ')
        .replace(/ /g, '')
        .replace(String.fromCharCode(8722), String.fromCharCode(45))
    );
  };

  const verifyDifferentBalanaces = (balanceA: string, balanceB: string) => {
    const a = parseFloatFromText(balanceA);
    const b = parseFloatFromText(balanceB);
    expect(a).not.to.be.NaN;
    expect(b).not.to.be.NaN;

    expect(a).to.not.equal(b);
  };
  const verifyAccountPage = (
    accountName: string,
    accountBalance: string,
    accountType: string
  ) => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('page-main-heading').should('contain.text', accountName);

    cy.getById('account-type').should('have.text', accountType);

    cy.getById('account-balance')
      .invoke('text')
      .then((currentBalance) => {
        expect(parseFloatFromText(currentBalance)).to.equal(
          parseFloatFromText(accountBalance)
        );
      });
  };

  const editAccountNameAndVerify = (
    oldAccountName: string,
    newAccountName: string,
    accountType: string
  ) => {
    cy.getById('account-row').should('not.contain.text', newAccountName);

    cy.getById('account-row').contains(oldAccountName).click();
    cy.getById('account-balance').then(($balanceElement) => {
      cy.wrap($balanceElement.text()).as('accountBalance');
    });

    cy.get<string>('@accountBalance').then((accountBalance) => {
      verifyAccountPage(oldAccountName, accountBalance, accountType);
    });

    // Account page
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('edit-account').click();

    // Edit account form
    cy.get('#account').clear();
    cy.get('#account').type(newAccountName);
    cy.getById('submit').click();

    cy.location('pathname').should('not.contain', '/edit');
    cy.visit('http://localhost:3000/accounts');

    // All accounts list
    cy.getById('account-row').should('contain.text', newAccountName);
    cy.getById('account-row').contains(newAccountName).click();

    // Account page
    cy.get<string>('@accountBalance').then((accountBalance) => {
      verifyAccountPage(newAccountName, accountBalance, accountType);
    });
  };

  const editAccountTypeAndVerify = (
    accountName: string,
    oldAccountType: string,
    newAccountType: string
  ) => {
    cy.getById('account-row').contains(accountName).click();
    // Account page

    cy.getById('account-balance').then(($balanceElement) => {
      cy.wrap($balanceElement.text()).as('accountBalance');
    });

    cy.get<string>('@accountBalance').then((accountBalance) => {
      verifyAccountPage(accountName, accountBalance, oldAccountType);
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('edit-account').click();

    // Edit account form
    cy.get('#type').select(newAccountType);
    cy.getById('submit').click();

    cy.location('pathname').should('not.contain', '/edit');
    cy.visit('http://localhost:3000/accounts');

    // All accounts list
    cy.getById('account-row').contains(accountName).click();

    // Account page
    cy.get<string>('@accountBalance').then((accountBalance) => {
      verifyAccountPage(accountName, accountBalance, newAccountType);
    });
  };

  const editAccountBalanceAndVerify = (
    accountName: string,
    newAccountBalance: string,
    accountType: string
  ) => {
    cy.getById('account-row').contains(accountName).click();
    cy.getById('account-balance').then(($balanceElement) => {
      cy.wrap($balanceElement.text()).as('oldAccountBalance');
    });

    cy.get<string>('@oldAccountBalance').then((oldAccountBalance) => {
      verifyAccountPage(accountName, oldAccountBalance, accountType);
      verifyDifferentBalanaces(oldAccountBalance, newAccountBalance);
    });

    // Account page

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('edit-account').click();

    // Edit account form
    cy.get('#amount').clear();
    cy.get('#amount').type(
      newAccountBalance
        .replace(',', '.')
        .replace(/ /g, '')
        .replace('€', '')
        .replace(String.fromCharCode(8722), String.fromCharCode(45)) // charcodes for different kind of `-`
    );

    cy.getById('submit').click();

    cy.location('pathname').should('not.contain', '/edit');
    cy.visit('http://localhost:3000/accounts');

    // All accounts list
    cy.getById('account-row').contains(accountName).click();

    // Account page
    verifyAccountPage(accountName, newAccountBalance, accountType);
  };

  const editAccountAllDetailsAndVerify = (
    oldAccountName: string,
    newAccountName: string,
    newAccountBalance: string,
    oldAccountType: string,
    newAccountType: string
  ) => {
    cy.getById('account-row').contains(oldAccountName).click();
    // Account page

    cy.getById('account-balance').then(($balanceElement) => {
      cy.wrap($balanceElement.text()).as('oldAccountBalance');
    });

    cy.get<string>('@oldAccountBalance').then((oldAccountBalance) => {
      verifyAccountPage(oldAccountName, oldAccountBalance, oldAccountType);
      verifyDifferentBalanaces(oldAccountBalance, newAccountBalance);
    });

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(100);
    cy.getById('edit-account').click();

    // Edit account form
    cy.get('#account').clear();
    cy.get('#account').type(newAccountName);
    cy.get('#type').select(newAccountType);
    cy.get('#amount').clear();
    cy.get('#amount').type(
      newAccountBalance
        .replace(',', '.')
        .replace(/ /g, '')
        .replace('€', '')
        .replace(String.fromCharCode(8722), String.fromCharCode(45)) // charcodes for different kind of `-`
    );

    cy.getById('submit').click();

    cy.location('pathname').should('not.contain', '/edit');
    cy.visit('http://localhost:3000/accounts');

    // All accounts list
    cy.getById('account-row').should('contain.text', newAccountName);
    cy.getById('account-row').contains(newAccountName).click();

    // Account page
    verifyAccountPage(newAccountName, newAccountBalance, newAccountType);
  };

  it('Change Cash account name', () => {
    editAccountNameAndVerify('Cash account', 'Cash Renamed account', 'Cash');
  });

  it('Change Saving account name', () => {
    editAccountNameAndVerify(
      'Saving account 2',
      'Saving Renamed account 2',
      'Savings'
    );
  });

  it('Change Investment account name', () => {
    editAccountNameAndVerify(
      'Investment account',
      'Investment Renamed account',
      'Investment'
    );
  });

  it('Change Credit account name', () => {
    editAccountNameAndVerify(
      'Credit account',
      'Credit Renamed account',
      'Credit'
    );
  });

  it('Change Loan account name', () => {
    editAccountNameAndVerify('Loan account', 'Loan Renamed account', 'Loan');
  });

  it('Change Cash account type', () => {
    editAccountTypeAndVerify('Cash account', 'Cash', 'Loan');
  });

  it('Change Saving account type', () => {
    editAccountTypeAndVerify('Saving account 2', 'Savings', 'Cash');
  });

  it('Change Ivestment account type', () => {
    editAccountTypeAndVerify('Investment account', 'Investment', 'Savings');
  });

  it('Change Credit account type', () => {
    editAccountTypeAndVerify('Credit account', 'Credit', 'Investment');
  });

  it('Change Loan account type', () => {
    editAccountTypeAndVerify('Loan account', 'Loan', 'Credit');
  });

  it('Change Cash account balance', () => {
    editAccountBalanceAndVerify('Cash account', '−1 040 350,00 €', 'Cash');
  });

  it('Change Saving account balance', () => {
    editAccountBalanceAndVerify('Saving account 2', '0,10 €', 'Savings');
  });

  it('Change Ivestment account balance', () => {
    editAccountBalanceAndVerify(
      'Investment account',
      '1 000 000,00 €',
      'Investment'
    );
  });

  it('Change Credit account balance', () => {
    editAccountBalanceAndVerify('Credit account', '−251 950,00 €', 'Credit');
  });

  it('Change Loan account balance', () => {
    editAccountBalanceAndVerify('Loan account', '0,00 €', 'Loan');
  });

  it('Change Cash account all fields', () => {
    editAccountAllDetailsAndVerify(
      'Cash account',
      'Changed to Savings',
      '100 000 000 000 000,00 €',
      'Cash',
      'Savings'
    );
  });

  it('Change Saving account all fields', () => {
    editAccountAllDetailsAndVerify(
      'Saving account 2',
      'Changed to Investment',
      '-99 000,10 €',
      'Savings',
      'Investment'
    );
  });

  it('Change Ivestment account all fields', () => {
    editAccountAllDetailsAndVerify(
      'Investment account',
      'Changed to Credit',
      '-10,01 €',
      'Investment',
      'Credit'
    );
  });

  it('Change Credit account all fields', () => {
    editAccountAllDetailsAndVerify(
      'Credit account',
      'Changed to Loan',
      '999 999,99 €',
      'Credit',
      'Loan'
    );
  });

  it('Change Loan account all fields', () => {
    editAccountAllDetailsAndVerify(
      'Loan account',
      'Changed to Credit',
      '-55,55 €',
      'Loan',
      'Credit'
    );
  });
});
