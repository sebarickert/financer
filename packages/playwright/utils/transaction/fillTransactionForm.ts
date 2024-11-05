import Decimal from 'decimal.js';

import { formatDate } from '$utils/api-helper';
import { Page } from '$utils/financer-page';

type TransactionFormFields = {
  fromAccount?: string;
  toAccount?: string;
  amount?: Decimal;
  date?: Date;
  description?: string;
};

export const fillTransactionForm = async (
  page: Page,
  fields: TransactionFormFields,
  formLocation: 'page' | 'drawer' = 'drawer',
) => {
  const { fromAccount, toAccount, amount, date, description } = fields;

  const formFields = {
    '#description': description,
    '#date': date ? formatDate(date) : null,
    '#amount': amount?.toNumber(),
    '#toAccount': toAccount ? { label: toAccount } : null,
    '#fromAccount': fromAccount ? { label: fromAccount } : null,
  };

  const transactionForm =
    formLocation === 'page'
      ? page.getByTestId('layout-root').getByTestId('transaction-form')
      : page.getByTestId('transaction-drawer').getByTestId('transaction-form');

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (selector === '#toAccount' || selector === '#fromAccount') {
        await transactionForm.locator(selector).selectOption(value as string);
      } else {
        await transactionForm.locator(selector).fill(value.toString());
      }
    }
  }
};
