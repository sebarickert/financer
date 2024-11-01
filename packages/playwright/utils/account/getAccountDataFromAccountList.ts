import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

type AccountRow = {
  name: string;
  balance: Decimal;
};

export const getAccountDataFromAccountList = async (
  page: Page,
): Promise<AccountRow[]> => {
  const accountList = await page
    .getByTestId('account-list')
    .first()
    .isVisible();

  if (!accountList) {
    throw new Error('Account list not found');
  }

  const accountRows = (
    await page.getByTestId('account-row').evaluateAll((element) => {
      return Array.from(element).map((child) => {
        const name =
          child.querySelector('[data-testid="account-name"]')?.textContent ??
          '';
        const balance =
          child.querySelector('[data-testid="account-balance"]')?.textContent ??
          '';

        return { name, balance };
      });
    })
  ).map((row) => ({ ...row, balance: parseCurrency(row.balance) }));

  return accountRows;
};
