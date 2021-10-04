const verifyAccountPage = (
  accountName: string,
  accountBalance: string,
  accountType: string
) => {
  cy.get('[data-testid="account-hero"] [data-testid="hero-title"]').should(
    "contain.text",
    accountName
  );

  cy.get('[data-testid="type"] > dd').should("have.text", accountType);
  cy.get('[data-testid="balance"] > dd')
    .invoke("text")
    .invoke("replace", /\u00a0/g, " ")
    .should(
      "equal",
      accountBalance.replace(String.fromCharCode(45), String.fromCharCode(8722))
    ); // charcodes for different kind of `-`
};

const editAccountNameAndVerify = (
  oldAccountName: string,
  newAccountName: string,
  accountBalance: string,
  accountType: string
) => {
  cy.get('[data-testid="account-row"').should(
    "not.contain.text",
    newAccountName
  );

  cy.get("[data-testid='account-row'").contains(oldAccountName).click();
  verifyAccountPage(oldAccountName, accountBalance, accountType);
  // Account page

  cy.get("[data-testid='edit-account']").click();

  // Edit account form
  cy.get("#account").clear();
  cy.get("#account").type(newAccountName);
  cy.get("[data-testid='submit']").click();

  cy.location("pathname").should("not.contain", "/edit");
  cy.visit("http://localhost:3000/accounts");

  // All accounts list
  cy.get('[data-testid="account-row"').should("contain.text", newAccountName);
  cy.get("[data-testid='account-row']").contains(newAccountName).click();

  // Account page
  verifyAccountPage(newAccountName, accountBalance, accountType);
};

const editAccountTypeAndVerify = (
  accountName: string,
  accountBalance: string,
  oldAccountType: string,
  newAccountType: string
) => {
  cy.get("[data-testid='account-row'").contains(accountName).click();
  verifyAccountPage(accountName, accountBalance, oldAccountType);
  // Account page

  cy.get("[data-testid='edit-account']").click();

  // Edit account form
  cy.get("#type").select(newAccountType);
  cy.get("[data-testid='submit']").click();

  cy.location("pathname").should("not.contain", "/edit");
  cy.visit("http://localhost:3000/accounts");

  // All accounts list
  cy.get("[data-testid='account-row']").contains(accountName).click();

  // Account page
  verifyAccountPage(accountName, accountBalance, newAccountType);
};

const editAccountBalanceAndVerify = (
  accountName: string,
  oldAccountBalance: string,
  newAccountBalance: string,
  accountType: string
) => {
  cy.get("[data-testid='account-row'").contains(accountName).click();
  verifyAccountPage(accountName, oldAccountBalance, accountType);
  // Account page

  cy.get("[data-testid='edit-account']").click();

  // Edit account form
  cy.get("#amount").clear();
  cy.get("#amount").type(
    newAccountBalance
      .replace(",", ".")
      .replace(/ /g, "")
      .replace("€", "")
      .replace(String.fromCharCode(8722), String.fromCharCode(45)) // charcodes for different kind of `-`
  );

  //   cy.get("#amount").invoke(
  //     "val",
  //     newAccountBalance.replace(",", ".").replace(/ /g, "").replace("€", "")
  //   );
  cy.get("[data-testid='submit']").click();

  cy.location("pathname").should("not.contain", "/edit");
  cy.visit("http://localhost:3000/accounts");

  // All accounts list
  cy.get("[data-testid='account-row']").contains(accountName).click();

  // Account page
  verifyAccountPage(accountName, newAccountBalance, accountType);
};

const editAccountAllDetailsAndVerify = (
  oldAccountName: string,
  newAccountName: string,
  oldAccountBalance: string,
  newAccountBalance: string,
  oldAccountType: string,
  newAccountType: string
) => {
  cy.get("[data-testid='account-row'").contains(oldAccountName).click();
  verifyAccountPage(oldAccountName, oldAccountBalance, oldAccountType);
  // Account page

  cy.get("[data-testid='edit-account']").click();

  // Edit account form
  cy.get("#account").clear();
  cy.get("#account").type(newAccountName);
  cy.get("#type").select(newAccountType);
  cy.get("#amount").clear();
  cy.get("#amount").type(
    newAccountBalance
      .replace(",", ".")
      .replace(/ /g, "")
      .replace("€", "")
      .replace(String.fromCharCode(8722), String.fromCharCode(45)) // charcodes for different kind of `-`
  );

  cy.get("[data-testid='submit']").click();

  cy.location("pathname").should("not.contain", "/edit");
  cy.visit("http://localhost:3000/accounts");

  // All accounts list
  cy.get('[data-testid="account-row"').should("contain.text", newAccountName);
  cy.get("[data-testid='account-row']").contains(newAccountName).click();

  // Account page
  verifyAccountPage(newAccountName, newAccountBalance, newAccountType);
};

describe("Account editing", () => {
  beforeEach(() => cy.visit("http://localhost:3000/accounts"));
  it("Change Cash account name", () => {
    editAccountNameAndVerify(
      "Cash account",
      "Cash Renamed account",
      "4 350,00 €",
      "Cash"
    );
  });
  it("Change Saving account name", () => {
    editAccountNameAndVerify(
      "Saving account 2",
      "Saving Renamed account 2",
      "51 000,00 €",
      "Savings"
    );
  });
  it("Change Ivestment account name", () => {
    editAccountNameAndVerify(
      "Investment account",
      "Investment Renamed account",
      "0,00 €",
      "Investment"
    );
  });
  it("Change Credit account name", () => {
    editAccountNameAndVerify(
      "Credit account",
      "Credit Renamed account",
      "−950,00 €",
      "Credit"
    );
  });
  it("Change Loan account name", () => {
    editAccountNameAndVerify(
      "Loan account",
      "Loan Renamed account",
      "−5 000,00 €",
      "Loan"
    );
  });

  it("Change Cash account type", () => {
    editAccountTypeAndVerify("Cash account", "4 350,00 €", "Cash", "Loan");
  });
  it("Change Saving account type", () => {
    editAccountTypeAndVerify(
      "Saving account 2",
      "51 000,00 €",
      "Savings",
      "Cash"
    );
  });
  it("Change Ivestment account type", () => {
    editAccountTypeAndVerify(
      "Investment account",
      "0,00 €",
      "Investment",
      "Savings"
    );
  });
  it("Change Credit account type", () => {
    editAccountTypeAndVerify(
      "Credit account",
      "−950,00 €",
      "Credit",
      "Investment"
    );
  });
  it("Change Loan account type", () => {
    editAccountTypeAndVerify("Loan account", "−5 000,00 €", "Loan", "Credit");
  });

  it("Change Cash account balance", () => {
    editAccountBalanceAndVerify(
      "Cash account",
      "4 350,00 €",
      "−14 350,00 €",
      "Cash"
    );
  });
  it("Change Saving account balance", () => {
    editAccountBalanceAndVerify(
      "Saving account 2",
      "51 000,00 €",
      "0,10 €",
      "Savings"
    );
  });
  it("Change Ivestment account balance", () => {
    editAccountBalanceAndVerify(
      "Investment account",
      "0,00 €",
      "1 000 000,00 €",
      "Investment"
    );
  });
  it("Change Credit account balance", () => {
    editAccountBalanceAndVerify(
      "Credit account",
      "−950,00 €",
      "−251 950,00 €",
      "Credit"
    );
  });
  it("Change Loan account balance", () => {
    editAccountBalanceAndVerify(
      "Loan account",
      "−5 000,00 €",
      "0,00 €",
      "Loan"
    );
  });

  it("Change Cash account all fields", () => {
    editAccountAllDetailsAndVerify(
      "Cash account",
      "Changed to Savings",
      "4 350,00 €",
      "100 000 000 000 000,00 €",
      "Cash",
      "Savings"
    );
  });
  it("Change Saving account all fields", () => {
    editAccountAllDetailsAndVerify(
      "Saving account 2",
      "Changed to Investment",
      "51 000,00 €",
      "-99 000,10 €",
      "Savings",
      "Investment"
    );
  });
  it("Change Ivestment account all fields", () => {
    editAccountAllDetailsAndVerify(
      "Investment account",
      "Changed to Credit",
      "0,00 €",
      "-10,01 €",
      "Investment",
      "Credit"
    );
  });
  it("Change Credit account all fields", () => {
    editAccountAllDetailsAndVerify(
      "Credit account",
      "Changed to Loan",
      "−950,00 €",
      "999 999,99 €",
      "Credit",
      "Loan"
    );
  });
  it("Change Loan account all fields", () => {
    editAccountAllDetailsAndVerify(
      "Loan account",
      "Changed to Credit",
      "−5 000,00 €",
      "-55,55 €",
      "Loan",
      "Credit"
    );
  });
});
