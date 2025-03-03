import Decimal from 'decimal.js';

import {
  TransactionTemplateType,
  TransactionType,
} from '@/types/generated/financer';
import { Page } from '@/utils/financer-page';

interface TemplateFormFields {
  templateType?: TransactionTemplateType;
  transactionType?: TransactionType;
  name?: string;
  description?: string;
  amount?: Decimal;
  fromAccount?: string;
  toAccount?: string;
  dayOfMonth?: Decimal;
  dayOfMonthToCreate?: Decimal;
}

export const fillTemplateForm = async (
  page: Page,
  fields: TemplateFormFields,
) => {
  const {
    templateType,
    transactionType,
    name,
    description,
    amount,
    fromAccount,
    toAccount,
    dayOfMonth,
    dayOfMonthToCreate,
  } = fields;

  const formFields = {
    '#templateType': templateType ? { label: templateType } : null,
    '#templateVisibility': transactionType ? { label: transactionType } : null,
    '#templateName': name,
    '#description': description,
    '#amount': amount ? amount.toNumber() : null,
    '#toAccount': toAccount ? { label: toAccount } : null,
    '#fromAccount': fromAccount ? { label: fromAccount } : null,
    '#dayOfMonth': dayOfMonth ? dayOfMonth.toNumber() : null,
    '#dayOfMonthToCreate': dayOfMonthToCreate
      ? dayOfMonthToCreate.toNumber()
      : null,
  };

  const categoryForm = page.getByTestId('template-form');

  for (const [selector, value] of Object.entries(formFields)) {
    if (value) {
      if (
        selector === '#templateType' ||
        selector === '#templateVisibility' ||
        selector === '#toAccount' ||
        selector === '#fromAccount'
      ) {
        await categoryForm
          .locator(selector)
          .selectOption(value as { label: string });
      } else {
        await categoryForm.locator(selector).fill(value as string);
      }
    }
  }
};
