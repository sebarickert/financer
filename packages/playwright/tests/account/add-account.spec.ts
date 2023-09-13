import { applyFixture } from '$utils/load-fixtures';
import { test, expect, Page } from '$utils/financer-page';



test.describe.parallel('Account creation', () => {
  test.beforeAll(async () => {
    await applyFixture('accounts-only');    
  })

  test.beforeEach(async ({ page }) => {
    await page.goto('/accounts');
  });

  const addAccountAndVerifyDetails = async (
    page: Page,
    accountType,
    accountBalance,
    expectedType,
    expectedBalance
  ) => {


    
    const newAccountName = `New Test ${expectedType} Account ${Math.random()}`;
    const accountRow = page.getByTestId('account-row');
    const accountRowText = await accountRow.first().textContent();
    expect(accountRowText).not.toContain(newAccountName);

    await page.getByTestId("add-account").click();

    // Add account form
    await page.fill('#name', newAccountName);
    await page.fill('#balance', accountBalance);
    await page.selectOption('#type', accountType);
    await page.getByTestId("submit").click();


    await expect(page).toHaveURL(/\/accounts\/?$/);

    await page.click(`text=${newAccountName}`);

    await expect(page).not.toHaveURL(/\/accounts\/?$/);

    await expect(page.getByTestId('account-type')).toHaveText(expectedType);
    await expect(page.getByTestId('account-balance')).toHaveText(expectedBalance);
  };

  test('Add Cash account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'credit',
      '1000',
      'Credit',
      '1 000,00 €'
    );
  });

  test('Add Saving account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'savings', '0', 'Savings', '0,00 €');
  });

  test('Add Investment account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'investment',
      '0.16',
      'Investment',
      '0,16 €'
    );
  });

  test('Add Credit account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'credit',
      '100000000000000000000',
      'Credit',
      '100 000 000 000 000 000 000,00 €'
    );
  });

  test('Add Loan account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'loan', '1', 'Loan', '1,00 €');
  });
});