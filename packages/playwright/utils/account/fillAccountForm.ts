import Decimal from 'decimal.js';

import { Page } from '@/utils/financer-page';

interface AccountFormFields {
  name?: string;
  balance?: Decimal;
  type?: string;
}

export const fillAccountForm = async (
  page: Page,
  fields: AccountFormFields,
) => {
  const { name, balance, type } = fields;

  const accountForm = page.getByTestId('account-form');

  const formFields = {
    '#name': name,
    '#balance': balance?.toNumber().toString(),
    '#type': type
      ? accountForm.getByLabel(type, { exact: true }).check()
      : undefined,
  };

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === '#type') {
        await (value as Promise<void>);
      } else {
        await accountForm.locator(selector).fill(value as string);
      }
    }
  }
};
