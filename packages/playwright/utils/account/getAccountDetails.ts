import { expect } from '@playwright/test';
import Decimal from 'decimal.js';

import { parseCurrency } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

type AccountDetails = {
  id: string;
  balance: Decimal;
  name: string;
  type: string;
};

export const getAccountDetails = async (
  page: Page,
): Promise<AccountDetails> => {
  await expect(page).toHaveURL(/\/accounts\/[\da-fA-F-]{36}/i, {
    timeout: 5000,
  });

  await expect(page.getByTestId('account-balance')).toBeVisible({
    timeout: 5000,
  });

  const balance = parseCurrency(
    (await page.getByTestId('account-balance').textContent()) ?? '',
  );

  const name = (await page.getByTestId('account-name').textContent()) ?? '';

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
    balance,
    type,
  };
};