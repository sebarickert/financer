import Decimal from 'decimal.js';

import { TransactionType } from '$types/generated/financer';
import { applyFixture } from '$utils/applyFixture';
import { test, expect } from '$utils/financer-page';
import { fillTemplateForm } from '$utils/template/fillTemplateForm';
import { getTemplateDataFromTemplateList } from '$utils/template/getTemplateDataFromTemplateList';
import { getTemplateFormValues } from '$utils/template/getTemplateFormValues';

test.describe('Edit Template', () => {
  test.beforeEach(async ({ page }) => {
    await applyFixture();
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

    await page
      .getByTestId('template-form')
      .locator('button[type=submit]')
      .click();

    const updatedTemplates = await getTemplateDataFromTemplateList(page);

    expect(updatedTemplates).toEqual(
      expect.arrayContaining(['Edited Template']),
    );
    expect(updatedTemplates).not.toEqual(
      expect.arrayContaining([initialTemplates[0]]),
    );

    await page.getByRole('link', { name: updatedValues.name }).click();

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
