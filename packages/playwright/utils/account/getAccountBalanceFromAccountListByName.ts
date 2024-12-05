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
    .getByTestId('account-list-item')
    .filter({ hasText: accountName })
    .first()
    .getByTestId('balance-amount')
    .textContent();

  const accountUpcomingBalance = (await page
    .getByTestId('account-list-item')
    .filter({ hasText: accountName })
    .first()
    .getByTestId('upcoming-balance')
    .isVisible())
    ? await page
        .getByTestId('account-list-item')
        .filter({ hasText: accountName })
        .first()
        .getByTestId('upcoming-balance')
        .textContent()
    : undefined;

  if (!accountBalance) {
    throw new Error(`Account balance not found for account ${accountName}`);
  }

  return parseCurrency(accountUpcomingBalance ?? accountBalance);
};
