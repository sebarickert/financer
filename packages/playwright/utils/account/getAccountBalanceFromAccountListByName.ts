import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

export const getAccountBalanceFromAccountListByName = async (
  page: Page,
  accountName: string,
) => {
  await expect(page).toHaveURL(/\/accounts\/?$/, { timeout: 5000 });
  await expect(page.getByTestId('account-list').first()).toBeVisible({
    timeout: 5000,
  });

  const accountBalance = await page
    .getByTestId('account-name')
    .getByText(accountName)
    .evaluate((el) => el.nextElementSibling?.textContent);

  if (!accountBalance) {
    throw new Error(`Account balance not found for account ${accountName}`);
  }

  return parseCurrency(accountBalance);
};
