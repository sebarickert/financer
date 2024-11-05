import Decimal from 'decimal.js';

import { Page } from '$utils/financer-page';

type AccountFormFields = {
  name?: string;
  balance?: Decimal;
  type?: string;
};

export const fillAccountForm = async (
  page: Page,
  fields: AccountFormFields,
) => {
  const { name, balance, type } = fields;

  const formFields = {
    '#name': name,
    '#balance': balance?.toNumber(),
    '#type': type ? { label: type } : undefined,
  };

  const accountForm = page.getByTestId('account-form');

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === '#type') {
        await accountForm.locator(selector).selectOption(value as string);
      } else {
        await accountForm.locator(selector).fill(value.toString());
      }
    }
  }
};
