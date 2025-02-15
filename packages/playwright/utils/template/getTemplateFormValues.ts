import { Locator, expect } from '@playwright/test';
import Decimal from 'decimal.js';

import {
  TransactionTemplateType,
  TransactionType,
} from '$types/generated/financer';
import { Page } from '$utils/financer-page';

const getFieldValue = async (locator: Locator) => {
  if ((await locator.count()) > 0) {
    const tagName = await locator.evaluate((el) => el.tagName);

    if (tagName === 'SELECT') {
      const selectedOption = await locator
        .locator('option:checked')
        .textContent();
      return selectedOption ? selectedOption.trim() : undefined;
    }

    return locator.inputValue();
  }

  return undefined;
};

interface TemplateFormFields {
  id: string;
  templateType?: TransactionTemplateType;
  transactionType?: TransactionType;
  name?: string;
  description?: string;
  amount?: Decimal;
  fromAccount?: string;
  toAccount?: string;
  dayOfMonth?: Decimal;
  dayOfMonthToCreate?: Decimal;
  categoriesCount: number;
}

export const getTemplateFormValues = async (
  page: Page,
): Promise<TemplateFormFields> => {
  await expect(page).toHaveURL(/templates\/[\da-fA-F-]{36}/i, {
    timeout: 5000,
  });
  await expect(page.getByTestId('template-form')).toBeVisible({
    timeout: 5000,
  });

  const templateForm = page.getByTestId('template-form');

  const templateType = (await getFieldValue(
    templateForm.locator('#templateType'),
  )) as TransactionTemplateType;
  const transactionType = (await getFieldValue(
    templateForm.locator('#templateVisibility'),
  )) as TransactionType;
  const name = await getFieldValue(templateForm.locator('#templateName'));
  const description = await getFieldValue(templateForm.locator('#description'));
  const amount = await getFieldValue(templateForm.locator('#amount'));
  const toAccount = await getFieldValue(templateForm.locator('#toAccount'));
  const fromAccount = await getFieldValue(templateForm.locator('#fromAccount'));
  const dayOfMonth = await getFieldValue(templateForm.locator('#dayOfMonth'));
  const dayOfMonthToCreate = await getFieldValue(
    templateForm.locator('#dayOfMonthToCreate'),
  );

  const categoriesCount = await templateForm
    .locator('[data-testid="transaction-categories-item"]')
    .count();

  const url = new URL(page.url()).pathname;
  const id = /[0-9a-fA-F-]{36}/.exec(url)?.[0] ?? '';

  return {
    id,
    templateType,
    transactionType,
    name,
    description,
    amount: amount ? new Decimal(amount) : undefined,
    toAccount,
    fromAccount,
    dayOfMonth: dayOfMonth ? new Decimal(dayOfMonth) : undefined,
    dayOfMonthToCreate: dayOfMonthToCreate
      ? new Decimal(dayOfMonthToCreate)
      : undefined,
    categoriesCount,
  };
};
