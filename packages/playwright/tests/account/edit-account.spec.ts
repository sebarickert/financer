import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';

test.describe('Account editing', () => {
    test.beforeEach(async ({ page }) => {
        await applyFixture('accounts-only');    
        await page.goto('/accounts');
    });

  const parseFloatFromText = (text) => {
    return parseFloat(
      text
        .replace(',', '.')
        .replace(/\u00a0/g, ' ')
        .replace(/ /g, '')
        .replace(String.fromCharCode(8722), String.fromCharCode(45))
    );
  };

  const verifyDifferentBalances = (balanceA, balanceB) => {
    const a = parseFloatFromText(balanceA);
    const b = parseFloatFromText(balanceB);
    expect(a).not.toBeNaN();
    expect(b).not.toBeNaN();

    expect(a).not.toEqual(b);
  };
  const verifyAccountPage = async (
    page: Page,
    accountName: string,
    accountBalance: string,
    accountType: string,
  ) => {
    await expect(page.getByTestId("page-main-heading")).toHaveText(accountName );

    await expect(page.getByTestId("account-type")).toHaveText(accountType);

    const currentBalance = await page.$eval('[data-testid="account-balance"]', el => el.textContent);
    expect(parseFloatFromText(currentBalance)).toEqual(parseFloatFromText(accountBalance));
  };

  const editAccountNameAndVerify = async (
    page: Page,
    oldAccountName,
    newAccountName,
    accountType
  ) => {
    await page.waitForSelector('[data-testid="account-row"]');
    const deletedAccountRow = await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    expect(deletedAccountRow).toBeNull();

    await page.$(`[data-testid="account-row"]:has-text("${oldAccountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${oldAccountName}")`);

    await page.waitForSelector('[data-testid="account-balance"]');
    const accountBalance = await page.$eval('[data-testid="account-balance"]', el => el.textContent);
    await verifyAccountPage(page, oldAccountName, accountBalance, accountType);

    await page.click('[data-testid="edit-account"]');

    await page.fill('#name', newAccountName);
    await page.click('[data-testid="submit"]');

    await expect(page).not.toHaveURL('/edit');
    await page.goto('/accounts');

    await page.waitForSelector('[data-testid="account-row"]');

    await page.waitForSelector('[data-testid="account-row"]');
    const newAccount = await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    expect(newAccount).not.toBeNull();
    await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${newAccountName}")`);

    await verifyAccountPage(page, newAccountName, accountBalance, accountType);
  };

  const editAccountTypeAndVerify = async (
    page: Page,
    accountName: string,
    oldAccountType: string,
    newAccountType: string,
  ) => {
    await page.$(`[data-testid="account-row"]:has-text("${accountName}")`);
    await page.getByTestId("account-row").getByText(accountName).click();

    await page.waitForSelector('[data-testid="account-balance"]');
    const accountBalance = await page.$eval('[data-testid="account-balance"]', el => el.textContent);
    await verifyAccountPage(page, accountName, accountBalance, oldAccountType);

    await page.click('[data-testid="edit-account"]');

    await page.selectOption('#type', newAccountType);
    await page.click('[data-testid="submit"]');

    await expect(page).not.toHaveURL('/edit');
    await page.goto('/accounts');

    await page.$(`[data-testid="account-row"]:has-text("${accountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${accountName}")`);

    await verifyAccountPage(page, accountName, accountBalance, newAccountType);
  };

  const editAccountBalanceAndVerify = async (
    page: Page,
    accountName: string,
    newAccountBalance: string,
    accountType: string,
  ) => {
    await page.$(`[data-testid="account-row"]:has-text("${accountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${accountName}")`);

    await page.waitForSelector('[data-testid="account-balance"]');
    const oldAccountBalance = await page.$eval('[data-testid="account-balance"]', el => el.textContent);
    await verifyAccountPage(page, accountName, oldAccountBalance, accountType);
    verifyDifferentBalances(oldAccountBalance, newAccountBalance);

    await page.click('[data-testid="edit-account"]');

    await page.fill('#balance', newAccountBalance.replace(',', '.').replace(/ /g, '').replace('€', '').replace(String.fromCharCode(8722), String.fromCharCode(45)));

    await page.click('[data-testid="submit"]');

    await expect(page).not.toHaveURL('/edit');
    await page.goto('/accounts');

    await page.$(`[data-testid="account-row"]:has-text("${accountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${accountName}")`);

    await verifyAccountPage(page, accountName, newAccountBalance, accountType);
  };

  const editAccountAllDetailsAndVerify = async (
    page: Page,
    oldAccountName: string,
    newAccountName: string,
    newAccountBalance: string,
    oldAccountType: string,
    newAccountType: string,
  ) => {
    await page.$(`[data-testid="account-row"]:has-text("${oldAccountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${oldAccountName}")`);

    await page.waitForSelector('[data-testid="account-balance"]');
    const oldAccountBalance = await page.$eval('[data-testid="account-balance"]', el => el.textContent);
    await verifyAccountPage(page, oldAccountName, oldAccountBalance, oldAccountType);
    verifyDifferentBalances(oldAccountBalance, newAccountBalance);

    await page.click('[data-testid="edit-account"]');

    await page.fill('#name', newAccountName);
    await page.selectOption('#type', newAccountType);
    await page.fill('#balance', newAccountBalance.replace(',', '.').replace(/ /g, '').replace('€', '').replace(String.fromCharCode(8722), String.fromCharCode(45)));

    await page.click('[data-testid="submit"]');

    await expect(page).not.toHaveURL('/edit');
    await page.goto('/accounts');

    await page.waitForSelector('[data-testid="account-row"]');

    const newAccount = await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    expect(newAccount).not.toBeNull();
    await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    await page.$(`[data-testid="account-row"]:has-text("${newAccountName}")`);
    await page.click(`[data-testid="account-row"]:has-text("${newAccountName}")`);

    await verifyAccountPage(page, newAccountName, newAccountBalance, newAccountType);
  };

  test('Change Cash account name', async ({page}) => {
    await editAccountNameAndVerify(page, 'Cash account', 'Cash Renamed account', 'Cash');
  });

  test('Change Saving account name', async ({page}) => {
    await editAccountNameAndVerify(
        page,
      'Saving account 2',
      'Saving Renamed account 2',
      'Savings'
    );
  });

  test('Change Investment account name', async ({page}) => {
    await editAccountNameAndVerify(
        page,
      'Investment account',
      'Investment Renamed account',
      'Investment'
    );
  });

  test('Change Credit account name', async ({page}) => {
    await editAccountNameAndVerify(
        page,
      'Credit account',
      'Credit Renamed account',
      'Credit'
    );
  });

  test('Change Loan account name', async ({page}) => {
    await editAccountNameAndVerify(page, 'Loan account', 'Loan Renamed account', 'Loan');
  });

  test('Change Cash account type', async ({page}) => {
    await editAccountTypeAndVerify(page, 'Cash account', 'Cash', 'Loan');
  });

  test('Change Saving account type', async ({page}) => {
    await editAccountTypeAndVerify(page, 'Saving account 2', 'Savings', 'Cash');
  });

  test('Change Investment account type', async ({page}) => {
    await editAccountTypeAndVerify(page, 'Investment account', 'Investment', 'Savings');
  });

  test('Change Credit account type', async ({page}) => {
    await editAccountTypeAndVerify(page, 'Credit account', 'Credit', 'Investment');
  });

  test('Change Loan account type', async ({page}) => {
    await editAccountTypeAndVerify(page, 'Loan account', 'Loan', 'Credit');
  });

  test('Change Cash account balance', async ({page}) => {
    await editAccountBalanceAndVerify(page, 'Cash account', '−1 040 350,00 €', 'Cash');
  });

  test('Change Saving account balance', async ({page}) => {
    await editAccountBalanceAndVerify(page, 'Saving account 2', '0,10 €', 'Savings');
  });

  test('Change Investment account balance', async ({page}) => {
    await editAccountBalanceAndVerify(
        page, 
      'Investment account',
      '1 000 000,00 €',
      'Investment'
    );
  });

  test('Change Credit account balance', async ({page}) => {
    await editAccountBalanceAndVerify(page, 'Credit account', '−251 950,00 €', 'Credit');
  });

  test('Change Loan account balance', async ({page}) => {
    await editAccountBalanceAndVerify(page, 'Loan account', '0,00 €', 'Loan');
  });

  test('Change Cash account all fields', async ({page}) => {
    await editAccountAllDetailsAndVerify(
        page,
      'Cash account',
      'Changed to Savings',
      '100 000 000 000 000,00 €',
      'Cash',
      'Savings'
    );
  });

  test('Change Saving account all fields', async ({page}) => {
    await editAccountAllDetailsAndVerify(
        page,
      'Saving account 2',
      'Changed to Investment',
      '-99 000,10 €',
      'Savings',
      'Investment'
    );
  });

  test('Change Investment account all fields', async ({page}) => {
    await editAccountAllDetailsAndVerify(
        page,
      'Investment account',
      'Changed to Credit',
      '-10,01 €',
      'Investment',
      'Credit'
    );
  });

  test('Change Credit account all fields', async ({page}) => {
    await editAccountAllDetailsAndVerify(
        page,
      'Credit account',
      'Changed to Loan',
      '999 999,99 €',
      'Credit',
      'Loan'
    );
  });

  test('Change Loan account all fields', async ({page}) => {
    await editAccountAllDetailsAndVerify(
        page,
      'Loan account',
      'Changed to Credit',
      '-55,55 €',
      'Loan',
      'Credit'
    );
  });
});