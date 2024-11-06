import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { test, expect } from '$utils/financer-page';
import { applyFixture } from '$utils/load-fixtures';
import { fillTemplateForm } from '$utils/template/fillTemplateForm';
import { getTemplateDataFromTemplateList } from '$utils/template/getTemplateDataFromTemplateList';
import { getTemplateFormValues } from '$utils/template/getTemplateFormValues';

test.describe('Edit Template', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture('accounts-only');
    await page.goto('/settings/templates');
  });

  test('should edit template details and verify changes are saved', async ({
    page,
  }) => {
    const initialTemplates = await getTemplateDataFromTemplateList(page);

    await page.getByText(initialTemplates[0]).click();

    const initialTemplateDetails = await getTemplateFormValues(page);

    const updatedValues = {
      name: 'Edited Template',
      description: 'Edited Template Description',
      amount: new Decimal(100),
      transactionType: TransactionType.Expense,
      fromAccount: 'Credit account',
    };

    await fillTemplateForm(page, updatedValues);

    await page.getByTestId('template-form').getByTestId('submit').click();

    const updatedTemplates = await getTemplateDataFromTemplateList(page);

    expect(updatedTemplates.includes('Edited Template')).toBe(true);
    expect(updatedTemplates.includes(initialTemplates[0])).toBe(false);

    await page.getByText(updatedValues.name).click();

    const updatedTemplateDetails = await getTemplateFormValues(page);

    expect(updatedTemplateDetails).not.toEqual(initialTemplateDetails);
    expect(updatedTemplateDetails).toMatchObject({
      name: updatedValues.name,
      description: updatedValues.description,
      amount: updatedValues.amount,
      transactionType: updatedValues.transactionType,
      fromAccount: updatedValues.fromAccount,
    });
  });
});
