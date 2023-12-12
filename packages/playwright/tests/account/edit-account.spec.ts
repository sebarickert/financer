import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe('Account editing', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/accounts');
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

  const verifyDifferentBalances = (balanceA: string, balanceB: string) => {
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
    accountType: string
  ) => {
    await expect(page.getByTestId('account-name')).toHaveText(accountName);
    await expect(page.getByTestId('account-details').getByTestId('account-details-item-description')).toHaveText(accountType);

    const currentBalance = await page
      .getByTestId('account-balance')
      .textContent();
    expect(parseFloatFromText(currentBalance)).toEqual(
      parseFloatFromText(accountBalance)
    );
  };

  const editAccountNameAndVerify = async (
    page: Page,
    oldAccountName: string,
    newAccountName: string,
    accountType: string
  ) => {
    const deletedAccountRow = page
      .getByTestId('account-row')
      .getByText(newAccountName);
    await expect(deletedAccountRow).toHaveCount(0);

    await page.getByTestId('account-row').getByText(oldAccountName).click();

    const accountBalance = await page
      .getByTestId('account-balance')
      .textContent();
    await verifyAccountPage(page, oldAccountName, accountBalance, accountType);

    await page.getByTestId('edit-account').click();

    await page.locator('#name').fill(newAccountName);
    await page.getByTestId('submit').click();

    await page.waitForURL(/\/accounts\/[a-zA-Z0-9-]+\/?$/);
    await page.goto('/accounts');

    const newAccount = page
      .getByTestId('account-row')
      .getByText(newAccountName);
    await expect(newAccount).toHaveCount(1);
    await page.getByTestId('account-row').getByText(newAccountName).click();

    await verifyAccountPage(page, newAccountName, accountBalance, accountType);
  };

  const editAccountTypeAndVerify = async (
    page: Page,
    accountName: string,
    oldAccountType: string,
    newAccountType: string
  ) => {
    await page.getByTestId('account-row').getByText(accountName).click();

    const accountBalance = await page
      .getByTestId('account-balance')
      .textContent();
    await verifyAccountPage(page, accountName, accountBalance, oldAccountType);

    await page.getByTestId('edit-account').click();

    await page.locator('#type').selectOption(newAccountType);
    await page.getByTestId('submit').click();

    await page.waitForURL(/\/accounts\/[a-zA-Z0-9-]+\/?$/);

    await page.goto('/accounts');

    await page.getByTestId('account-row').getByText(accountName).click();

    await verifyAccountPage(page, accountName, accountBalance, newAccountType);
  };

  const editAccountBalanceAndVerify = async (
    page: Page,
    accountName: string,
    newAccountBalance: string,
    accountType: string
  ) => {
    await page.getByTestId('account-row').getByText(accountName).click();

    const oldAccountBalance = await page
      .getByTestId('account-balance')
      .textContent();
    await verifyAccountPage(page, accountName, oldAccountBalance, accountType);
    verifyDifferentBalances(oldAccountBalance, newAccountBalance);

    await page.getByTestId('edit-account').click();

    await page
      .locator('#balance')
      .fill(
        newAccountBalance
          .replace(',', '.')
          .replace(/ /g, '')
          .replace('€', '')
          .replace(String.fromCharCode(8722), String.fromCharCode(45))
      );

    await page.getByTestId('submit').click();

    await page.waitForURL(/\/accounts\/[a-zA-Z0-9-]+\/?$/);
    await page.goto('/accounts');

    await page.getByTestId('account-row').getByText(accountName).click();

    await verifyAccountPage(page, accountName, newAccountBalance, accountType);
  };

  const editAccountAllDetailsAndVerify = async (
    page: Page,
    oldAccountName: string,
    newAccountName: string,
    newAccountBalance: string,
    oldAccountType: string,
    newAccountType: string
  ) => {
    await page.getByTestId('account-row').getByText(oldAccountName).click();

    const oldAccountBalance = await page
      .getByTestId('account-balance')
      .textContent();
    await verifyAccountPage(
      page,
      oldAccountName,
      oldAccountBalance,
      oldAccountType
    );
    verifyDifferentBalances(oldAccountBalance, newAccountBalance);

    await page.getByTestId('edit-account').click();

    await page.locator('#name').fill(newAccountName);
    await page.locator('#type').selectOption(newAccountType);
    await page
      .locator('#balance')
      .fill(
        newAccountBalance
          .replace(',', '.')
          .replace(/ /g, '')
          .replace('€', '')
          .replace(String.fromCharCode(8722), String.fromCharCode(45))
      );

    await page.getByTestId('submit').click();

    await page.waitForURL(/\/accounts\/[a-zA-Z0-9-]+\/?$/);
    await page.goto('/accounts');

    const newAccount = page
      .getByTestId('account-row')
      .getByText(newAccountName);

    await expect(newAccount).toHaveCount(1);
    await page.getByTestId('account-row').getByText(newAccountName).click();

    await verifyAccountPage(
      page,
      newAccountName,
      newAccountBalance,
      newAccountType
    );
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Change Cash account name', async ({ page }) => {
    await editAccountNameAndVerify(
      page,
      'Cash account',
      'Cash Renamed account',
      'Cash'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Saving account name', async ({ page }) => {
    await editAccountNameAndVerify(
      page,
      'Saving account 2',
      'Saving Renamed account 2',
      'Savings'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Investment account name', async ({ page }) => {
    await editAccountNameAndVerify(
      page,
      'Investment account',
      'Investment Renamed account',
      'Investment'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Credit account name', async ({ page }) => {
    await editAccountNameAndVerify(
      page,
      'Credit account',
      'Credit Renamed account',
      'Credit'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Loan account name', async ({ page }) => {
    await editAccountNameAndVerify(
      page,
      'Loan account',
      'Loan Renamed account',
      'Loan'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Cash account type', async ({ page }) => {
    await editAccountTypeAndVerify(page, 'Cash account', 'Cash', 'Loan');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Saving account type', async ({ page }) => {
    await editAccountTypeAndVerify(page, 'Saving account 2', 'Savings', 'Cash');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Investment account type', async ({ page }) => {
    await editAccountTypeAndVerify(
      page,
      'Investment account',
      'Investment',
      'Savings'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Credit account type', async ({ page }) => {
    await editAccountTypeAndVerify(
      page,
      'Credit account',
      'Credit',
      'Investment'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Loan account type', async ({ page }) => {
    await editAccountTypeAndVerify(page, 'Loan account', 'Loan', 'Credit');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Cash account balance', async ({ page }) => {
    await editAccountBalanceAndVerify(
      page,
      'Cash account',
      '−1 040 350,00 €',
      'Cash'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Saving account balance', async ({ page }) => {
    await editAccountBalanceAndVerify(
      page,
      'Saving account 2',
      '0,10 €',
      'Savings'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Investment account balance', async ({ page }) => {
    await editAccountBalanceAndVerify(
      page,
      'Investment account',
      '1 000 000,00 €',
      'Investment'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Credit account balance', async ({ page }) => {
    await editAccountBalanceAndVerify(
      page,
      'Credit account',
      '−251 950,00 €',
      'Credit'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Loan account balance', async ({ page }) => {
    await editAccountBalanceAndVerify(page, 'Loan account', '0,00 €', 'Loan');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Cash account all fields', async ({ page }) => {
    await editAccountAllDetailsAndVerify(
      page,
      'Cash account',
      'Changed to Savings',
      '100 000 000 000 000,00 €',
      'Cash',
      'Savings'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Saving account all fields', async ({ page }) => {
    await editAccountAllDetailsAndVerify(
      page,
      'Saving account 2',
      'Changed to Investment',
      '-99 000,10 €',
      'Savings',
      'Investment'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Investment account all fields', async ({ page }) => {
    await editAccountAllDetailsAndVerify(
      page,
      'Investment account',
      'Changed to Credit',
      '-10,01 €',
      'Investment',
      'Credit'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Credit account all fields', async ({ page }) => {
    await editAccountAllDetailsAndVerify(
      page,
      'Credit account',
      'Changed to Loan',
      '999 999,99 €',
      'Credit',
      'Loan'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Change Loan account all fields', async ({ page }) => {
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
