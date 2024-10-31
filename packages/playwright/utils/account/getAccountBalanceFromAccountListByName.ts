import { parseCurrency } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

export const getAccountBalanceFromAccountListByName = async (
  page: Page,
  accountName: string,
) => {
  const accountBalance = await page
    .getByTestId('account-name')
    .getByText(accountName)
    .evaluate((el) => el.nextElementSibling?.textContent);

  if (!accountBalance) {
    throw new Error(`Account balance not found for account ${accountName}`);
  }

  return parseCurrency(accountBalance);
};
