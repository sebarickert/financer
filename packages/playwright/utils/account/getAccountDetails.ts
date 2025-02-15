import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page, expect } from '$utils/financer-page';

interface AccountDetails {
  id: string;
  balance: Decimal;
  name: string;
  type: string;
}

export const getAccountDetails = async (
  page: Page,
): Promise<AccountDetails> => {
  await expect(page).toHaveURL(/\/accounts\/[\da-fA-F-]{36}/i, {
    timeout: 5000,
  });

  await expect(page.getByTestId('balance-amount')).toBeVisible({
    timeout: 5000,
  });

  const balance = parseCurrency(
    (await page.getByTestId('balance-amount').textContent()) ?? '',
  );

  const upcomingBalanceElement = page.getByTestId('upcoming-balance');
  const upcomingBalance = (await upcomingBalanceElement.isVisible())
    ? parseCurrency((await upcomingBalanceElement.textContent()) ?? '')
    : undefined;

  const name =
    (await page.getByTestId('page-main-heading').textContent()) ?? '';

  const type =
    (await page
      .getByTestId('account-details-item')
      .getByText('Account Type')
      .evaluate((el) => el.parentElement?.nextElementSibling?.textContent)) ??
    '';

  const id =
    new URL(page.url()).pathname.split('/').filter(Boolean).pop() ?? '';

  return {
    id,
    name,
    balance: upcomingBalance ?? balance,
    type,
  };
};
