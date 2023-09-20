import { test, expect, Page } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';

test.describe.parallel('Account creation', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
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
    const accountRow = page
      .getByTestId('account-row')
      .getByText(newAccountName);
    await expect(accountRow).toHaveCount(0);

    await page.getByTestId('add-account').click();

    // Add account form
    await page.locator('#name').fill(newAccountName);
    await page.locator('#balance').fill(accountBalance);
    await page.locator('#type').selectOption(accountType);
    await page.getByTestId('submit').click();

    await expect(page).toHaveURL(/\/accounts\/?$/);

    await page.getByText(newAccountName).click();

    await expect(page).not.toHaveURL(/\/accounts\/?$/);

    await expect(page.getByTestId('account-type')).toHaveText(expectedType);
    await expect(page.getByTestId('account-balance')).toHaveText(
      expectedBalance
    );
  };

  // eslint-disable-next-line playwright/expect-expect
  test('Add Cash account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'credit',
      '1000',
      'Credit',
      '1 000,00 €'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Saving account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'savings', '0', 'Savings', '0,00 €');
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Investment account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'investment',
      '0.16',
      'Investment',
      '0,16 €'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Credit account', async ({ page }) => {
    await addAccountAndVerifyDetails(
      page,
      'credit',
      '100000000000000000000',
      'Credit',
      '100 000 000 000 000 000 000,00 €'
    );
  });

  // eslint-disable-next-line playwright/expect-expect
  test('Add Loan account', async ({ page }) => {
    await addAccountAndVerifyDetails(page, 'loan', '1', 'Loan', '1,00 €');
  });
});
